import { createLocalServer } from './server';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ApolloServer } from 'apollo-server-express';

let server: ApolloServer<any>;

const PORT = process.env.PORT || 4000;

const app = express();

async function startServer() {
  server = createLocalServer();
  await server.start();

  server.applyMiddleware({ app });
}

startServer();

const corsOptions = {
  origin: process.env.APP_DOMAIN,
  credentials: process.env.NODE_ENV === 'development' ? false : true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server?.graphqlPath}`
  );
});
