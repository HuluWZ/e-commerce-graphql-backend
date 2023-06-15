// const gql = require('graphql-tag');
import gql from 'graphql-tag';
const reviewSchema = gql`
  scalar DateTime
  
  type Review{
    _id: ID!
    user: User
    product: Product
    message: String
    rating: Float
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateReviewInput {
    user: ID!
    product: ID!
    message: String!
    rating: Float!
  }

  input UpdateReviewInput {
    user: ID
    product: ID
    message: String
    rating: Float
  }

  type Query {
    getReviews(total: Int): [Review]
    getReviewById(id:ID): Review
  }

  type ReviewResponse{
    success: Boolean!
    message: String
    review: Review
  }
  
  type Mutation {
    createReview(input: CreateReviewInput): ReviewResponse
    updateReview(id: ID!, input: UpdateReviewInput): ReviewResponse
    deleteReview(id: ID!): ReviewResponse  
  }
`;

export default reviewSchema;