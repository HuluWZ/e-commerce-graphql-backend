import gql from 'graphql-tag';

const cartSchema = gql`
   scalar DateTime
   
   type Item{
    product:Product!,
    quantity:Int!
   }

   type Cart{
    id:ID!
    items:[Item]
    user:User!
    price:Float!
    createdAt: DateTime
    updatedAt: DateTime
   }

   input ItemInput{
    product:ID!
    quantity:Int!
   }
   input CreateCartInput {
    items:[ItemInput]
    user: ID!
   }

   input ItemUpdateInput{
    product:ID
    quantity:Int
   }

   input UpdateCartInput{
    items:[ItemUpdateInput]
    quantity:Int
  }

  type Query{
   getCarts(total:Int!):[Cart!]
   getCartById(id:ID!):Cart
  }

  type CartResponse{
    success: Boolean!
    message: String
    cart: Cart
  }

  type Mutation{
    createCart(input:CreateCartInput):CartResponse
    updateCart(id:ID!,input:UpdateCartInput):CartResponse
    deleteCart(id:ID!):CartResponse
  }


`

export default cartSchema