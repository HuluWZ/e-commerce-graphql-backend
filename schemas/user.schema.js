// const gql = require('graphql-tag');
import gql from 'graphql-tag';
const userSchema = gql`
  scalar DateTime
  enum Role {
    ADMIN
    USER
  }

  type User{
    _id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    createdAt: DateTime
    updatedAt: DateTime
    role: Role
    reviews: [Review]
  }

  input SignupInput {
    firstName: String!
    lastName: String
    email: String!
    password: String!
    role: Role
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    password: String
    role: Role
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    getUsers(total: Int): [User]
    getUserById(id: ID!): User!
  }

  type JwtToken {
    token: String!
  }

  type UserResponse{
    success: Boolean!
    message: String
    user: User
  }
  
  type UserWithToken {
    _id: ID
    email: String
    firstName: String
    lastName: String
    role: Role
    createdAt: DateTime
    updatedAt: DateTime
    userJwtToken: JwtToken
  }

  type Mutation {
    login(input: LoginInput): UserWithToken
    signup(input: SignupInput): UserWithToken
    updateUser(id: ID!, input: UpdateUserInput): UserResponse
    deleteUser(id: ID!): UserResponse
  }
`;

export default userSchema;