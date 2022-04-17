import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

function createLocalServer(): any {
  return new ApolloServer({
    // context: () => ({ todosRepo } as Context),
    typeDefs,
    resolvers,
    // introspection: true,
  });
}

export { createLocalServer };
