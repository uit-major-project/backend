import { gql } from 'apollo-server';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

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
    small
    medium
    large
  }

  enum TaskStatus {
    open
    in_progress
    done
    cancelled
  }

  enum TaskCategory {
    cleaning
    moving
    electrician
    painter
    cook
    mechanic
    plumber
    driver
    technician
    # mounting
  }

  enum Stars {
    one
    two
    three
    four
    five
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

    description: String!
    dueDate: String
    location: String!
    pincode: String!
    user: User!

    taskerInContactId: String
    taskerAssignedId: String
    taskerInContact: Tasker!
    taskerAssigned: Tasker

    size: TaskSize!
    status: TaskStatus!

    category: TaskCategory!
    isPaymentDone: Boolean!

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
    createdAt: String
    updatedAt: String

    firstname: String!
    lastname: String!
    email: String!
    image: String!
    pincode: String
    phone: String
    permanentAddress: String

    pricePerHour: Int
    ratings: [Rating]
    experience: String
    category: TaskCategory

    isVerified: Boolean
    hasPaidOneTimeFee: Boolean
    isActive: Boolean

    pricePerHourInRs: Int

    rating: String
    ratingCount: Int

    area: String

    inContact: [Task]
    assigned: [Task]
  }

  # union CurrentUser = User | null

  type Query {
    # user
    getCurrentUser(jwt: String!): User
    users: [User]!
    user(id: ID!): User!

    # tasker
    tasker(id: ID!): Tasker!
    taskers: [Tasker]!

    # task
    task(id: ID!): Task!
    tasks: [Task]
    tasksByUserId(userId: ID!): [Task]!
  }

  type TaskerGoogleLoginResponse {
    tasker: Tasker!
    hasAccount: Boolean!
    message: String
  }

  type Mutation {
    #
    # user
    #
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

    #
    # tasker
    #
    taskerLoginWithGoogle(jwt: String!): TaskerGoogleLoginResponse

    createTasker(
      id: ID!
      firstname: String!
      lastname: String!
      email: String!
      image: String!
      pincode: String!
    ): Tasker

    updateTasker(
      id: ID!

      firstname: String
      lastname: String
      email: String
      image: String
      pincode: String
      phone: String
      permanentAddress: String

      pricePerHour: Int
      experience: String
      category: TaskCategory

      rating: String
      ratingCount: Int

      area: String

      isVerified: Boolean
      hasPaidOneTimeFee: Boolean
      isActive: Boolean # inContact: [Task] # assigned: [Task]
    ): Tasker

    #
    # TASK
    #
    createTask(
      # id: ID!
      # createdAt DateTime @default(now())
      # updatedAt DateTime @updatedAt

      # // title       String
      description: String!
      dueDate: String
      location: String!
      pincode: String!
      userEmail: String!
      taskerInContactEmail: String!

      # bills        Bill[]

      size: TaskSize!
      status: TaskStatus # rating: Rating
      category: TaskCategory!
    ): Task!

    updateTask(
      id: ID!

      firstname: String
      description: String
      dueDate: String
      location: String
      pincode: String
      userEmail: String
      taskerInContactEmail: String

      # bills        Bill[]

      size: TaskSize
      status: TaskStatus # rating: Rating
    ): Task!
  }
`;
