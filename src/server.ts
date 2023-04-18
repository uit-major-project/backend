import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';

function createLocalServer(): any {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext,
    introspection: true,
  });
}

export { createLocalServer };
