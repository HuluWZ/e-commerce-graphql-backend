// const gql = require('graphql-tag');
import gql from 'graphql-tag';
const productSchema = gql`
  scalar DateTime
  
  type Product{
    _id: ID!
    name: String!
    description: String!
    category: Category!
    price: Float!
    image: String!
    createdAt: DateTime
    updatedAt: DateTime
    reviews:[Review]
  }

  input CreateProductInput {
    name: String!
    description: String!
    category: ID!
    price: Float!
    image: String!
  }

  input UpdateProductInput {
    name: String
    description: String
    category: ID
    price: Float
    image: String
  }

  type Query {
    getProducts(total: Int): [Product]
    getProductById(id: ID!): Product!
  }

  type ProductResponse{
    success: Boolean!
    message: String
    product: Product
  }
  
  type Mutation {
    createProduct(input: CreateProductInput): ProductResponse
    updateProduct(id: ID!, input: UpdateProductInput): ProductResponse
    deleteProduct(id: ID!): ProductResponse
  }
`;

export default productSchema;