// const gql = require('graphql-tag');
import gql from 'graphql-tag';
const productSchema = gql`
  scalar DateTime
 
  type Category{
    _id: ID!
    name: String!
    description: String!
    createdAt: DateTime
    updatedAt: DateTime
    products:[Product!]!
  }

  input CreateCategoryInput {
    name: String!
    description: String!
  }

  input UpdateCategoryInput {
    name: String
    description: String
  }

  type Query {
    getCategorys(total: Int): [Category]
    getCategoryById(id: ID!): Category!
  }

  type CategoryResponse{
    success: Boolean!
    message: String
    category: Category
  }
  
  type Mutation {
    createCategory(input: CreateCategoryInput): CategoryResponse
    updateCategory(id: ID!, input: UpdateCategoryInput): CategoryResponse
    deleteCategory(id: ID!): CategoryResponse
  }
`;

export default productSchema;