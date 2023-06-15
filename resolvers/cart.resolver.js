import { GraphQLError } from "graphql";
import CartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js"
import throwCustomError, { ErrorTypes } from "../helpers/error-handler.helper.js";
import context from "../context/context.js";

const cartResolvers = {
  Query: {
    getCarts: async (_, { total }, context) => {
      try {
           const carts = await CartModel.find().sort({ createdAt: -1 }).limit(total)
           return carts
      }catch (error) {
          throw new GraphQLError(error.message);
      }
    },
    getCartById: async (_, { id }, context) => {
      try {
          const cart = await CartModel.findById(id)
          return cart
      }catch (error) {
          throw new GraphQLError(error.message);
     }
   } 
   
  },
  Mutation: {
    createCart: async (_, { input }, context) => {
      try {
        const cartData = new CartModel(input)
        const cart = cartData.save()
        // cart.price = context.price
        console.log(context);
        return {
          success: true,
          message: 'Products Added To Cart successfully',
          cart,
        };
      } catch (err) {
        throw new GraphQLError(err.message)
      }
    },
    updateCart: async (_, { id, input }, context) => {
      try {
        const cart = await CartModel.findByIdAndUpdate(id,input,{new:true})
        return {
          success: true,
          message: 'Cart Updated successfully',
          cart
        };
      } catch (err) {
        throw new GraphQLError(err.message)
      }
    },
    deleteCart: async (_, { id }, context) => {
       try {
        const cart = await CartModel.findByIdAndDelete(id)
        return {
          success: true,
          message: 'Cart Deleted successfully',
          cart
        };
      } catch (err) {
        throw new GraphQLError(err.message)
      }
    }
  },
  Cart: {
    user: async (parent, _, context) => {
      try {
        const {user} = parent;
        const users = await UserModel.findById(user)
        return {user:users}
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
    items: async(parent, args, context) =>{
      try {
        const { items } = parent
        const promises = items.map(async (item) => {
          const {product,quantity} = item
          const productId = await ProductModel.findById(product);
          return { product:productId, quantity}
        })
        //  
      const results = await Promise.all(promises);
      return results
    }catch (error) {  
      throw new GraphQLError(error.message)
    }
    },
    price: async (parent, args, context) => {
      try {
        var allItems = []
        var totalPrice = 0
        const { items } = parent   
        const promises = items.map(async (item) => {
          const {product,quantity} = item
          const productId = await ProductModel.findById(product);
          return { product:productId, quantity}
        })
        const results = await Promise.all(promises);
        results.map(({ product, quantity }) => {
          const { price } = product
           totalPrice += price * quantity
       })
        return totalPrice
      } catch (error) {
        throw new GraphQLError(error.message)
      }
  }
    
  }
}
export default cartResolvers
