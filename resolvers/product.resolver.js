import { GraphQLError } from 'graphql';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import ReviewModel from '../models/review.model.js';
import throwCustomError,{ ErrorTypes } from '../helpers/error-handler.helper.js';

const productResolver = {
  Query: {
    getProducts: async (_, { total }, contextValue) => {
      try {
        const products = await ProductModel.find()
          .sort({ createdAt: -1 })
          .limit(total);
    
        return products;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductById: async (parent, { id }, contextValue) => {
      try {
        const product = await ProductModel.findById(id);
        return product;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {

    createProduct: async (_, { input }, contextValue) => {
      try {
        const { name, description, price, image,category } = input;
        // const {role} = contextValue.user;
        // if (role == "USER") {
        //   throwCustomError(
        //     'USER are not allowed to Create Product',
        //     ErrorTypes.UNAUTHORIZED
        //   );
        // }
        const isProductExists = await ProductModel.find({ name });
        if (isProductExists.length > 0) {
          throwCustomError(
            'Product Name is already Registered',
            ErrorTypes.ALREADY_EXISTS
          );
        }
        // console.log(input);
        const productToCreate = new ProductModel(input);
        const product = await productToCreate.save();

        return {
          success: true,
          message: 'Product created successfully',
          product:  product
        };
      } catch (error) { 
        throw new GraphQLError(error.message);
      }
    },

    updateProduct: async (_, { id, input }, contextValue) => {
      try {
        const {role} = contextValue.user
        if (role == 'USER') {
          throwCustomError(
            'USER are not allowed to Update Product',
            ErrorTypes.UNAUTHORIZED
          );
        }
        // Update Product
        const product = await ProductModel.findOneAndUpdate({ id }, input, { new: true });
        console.log(product);
        return {
          success: true,
          message: 'User updated successfully',
          product: product
        };
      }catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    deleteProduct: async (_, { id }, contextValue) => { 
      try {
        // Delete Product
        const {role } = contextValue.user
        if (role == 'USER') {
          throwCustomError(
            'USER are not allowed to update this product',
            ErrorTypes.UNAUTHORIZED
          );
        }
        const product = await ProductModel.findByIdAndDelete(id);
        console.log(product);
        return {
          success: product ? true : false,
          message: product ? 'Product deleted successfully' : 'Product not found',
          product: product ? product : null
        }
      } catch (error) { 
        throw new GraphQLError(error.message);
      }
    }
  },
  Product: {
    category: async (parent, args, contextValue) => {
      try {
        const categoryID = parent.category;
        const category = await CategoryModel.findById(categoryID);
        return category;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    reviews: async (parent, args, contextValue) => { 
      try {
        const { id } = parent;
        const reviews = await ReviewModel.find({ product: id });
        return reviews;
      } catch (error) { 
        throw new GraphQLError(error.message);
      }
    }
  }
};

export default productResolver;
