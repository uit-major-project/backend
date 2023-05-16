import { createLocalServer } from './server';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { ApolloServer } from 'apollo-server-express';

// import * as Sentry from '@sentry/node';
// import { RewriteFrames } from '@sentry/integrations';

let server: ApolloServer<any>;

const PORT = process.env.PORT || 4000;

const app = express();

async function startServer() {
  server = createLocalServer();
  await server.start();

  server.applyMiddleware({ app, cors: false });
}

startServer();

/*
 * Sentry error handling
 */

// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   tracesSampleRate: 1.0,
//   integrations: [
//     new RewriteFrames({
//       root: global.__dirname,
//     }),
//   ],
// });

// app.use(
//   Sentry.Handlers.errorHandler({
//     shouldHandleError(error) {
//       // Capture all 404 and 500 errors
//       if (
//         error.status &&
//         [400, 401, 402, 403, 404, 500].includes(Number(error.status))
//       ) {
//         return true;
//       }
//       return false;
//     },
//   })
// );

console.log('APP_DOMAIN', process.env.APP_DOMAIN);

// const corsOptions = {
//   origin: [process.env.APP_DOMAIN],
//   credentials: true,
// };

const WHITELIST_DOMAINS = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:42029',
  process.env.APP_DOMAIN,
  process.env.ADMIN_DOMAIN,
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (WHITELIST_DOMAINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// if (process.env.NODE_ENV !== 'production') {
//   app.use(cors(corsOptions));
// } else {
//   app.use(cors(corsOptions));
// }

// app.use(cors());
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server?.graphqlPath}`
  );
});
