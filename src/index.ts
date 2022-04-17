import { createLocalServer } from './server';

const server = createLocalServer();
// connectDB();

type Props = {
  url: string;
};

server.listen().then(({ url }: Props) => {
  console.log(`🚀 Server ready at ${url}`);
});
