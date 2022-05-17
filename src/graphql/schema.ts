import { gql } from 'apollo-server';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    questions: [Question]
  }
  type Question {
    question: String!
    answer: String
    options: [String]
  }

  type User {
    id: ID!
    createdAt: String!
    updatedAt: String!

    firstname: String!
    lastname: String!
    email: String!
    image: String!
    phone: String
    permanentAddress: String
    tasks: [Task]
  }

  enum TaskSize {
    SMALL
    MEDIUM
    LARGE
  }

  enum TaskStatus {
    OPEN
    IN_PROGRESS
    DONE
    CANCELLED
  }

  enum TaskType {
    GENERAL
    CLEANING
    LABOUR
    ELECTRICIAN
    PLUMBER
    PAINTER
    COOK
    DRIVER
    OTHER
  }

  enum Stars {
    ONE
    TWO
    THREE
    FOUR
    FIVE
  }

  type Rating {
    id: ID!
    createdAt: String!
    updatedAt: String!

    userId: String!
    taskId: String!
    stars: Stars!
    userComment: String
    task: [Task]
  }

  type Task {
    id: ID!
    createdAt: String!
    updatedAt: String!

    description: String
    dueDate: String
    location: String
    pincode: String
    user: User

    taskerInContactId: String
    taskerAssignedId: String
    taskerInContact: Tasker
    taskerAssigned: Tasker

    size: TaskSize
    status: TaskStatus

    rating: Rating

    userId: String
    ratingId: String
  }

  type admin {
    id: ID!
    createdAt: String!
    updatedAt: String!

    firstname: String!
    lastname: String!
    email: String!
    image: String
    phone: String
    permanentAddress: String
  }

  type Tasker {
    id: ID!
    createdAt: String!
    updatedAt: String!

    firstname: String!
    lastname: String!
    email: String!
    image: String!
    pincode: String!
    phone: String
    permanentAddress: String

    isVerified: Boolean
    hasPaidOneTimeFee: Boolean
    isActive: Boolean

    inContact: [Task]
    assigned: [Task]
  }

  # union CurrentUser = User | null

  type Query {
    getCurrentUser: User
    users: [User]!
    user(id: ID!): User!
  }

  type Mutation {
    createUser(
      id: ID!
      firstname: String!
      lastname: String!
      email: String!
      image: String!
    ): User
    updateUser(
      id: ID!
      firstname: String
      lastname: String
      email: String
      image: String
      phone: String
      permanentAddress: String # tasks: [Task]
    ): User
    deleteUser(id: ID!): User!

    # login/signup using Sign In With Google button takes in a jwt
    loginWithGoogle(jwt: String!): User!
  }
`;
