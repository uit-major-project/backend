const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const questions = [
  {
    question: 'The Awakening',
    answer: 'Kate Chopin',
    options: ['1', '2', '3'],
  },
  {
    question: 'The Awakening',
    answer: 'Kate Chopin',
    options: ['1', '2', '3'],
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
export const resolvers = {
  Query: {
    books: () => books,
    questions: () => questions,
  },
};
