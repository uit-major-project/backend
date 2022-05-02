import { createLocalServer } from './server';

const server = createLocalServer();
// connectDB();

type Props = {
  url: string;
};

const PORT = process.env.PORT || 4000;

server.listen({ port: PORT }).then(({ url }: Props) => {
  console.log(`🚀 Server ready at ${url}`);
});
