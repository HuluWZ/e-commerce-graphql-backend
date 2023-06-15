import { GraphQLError } from 'graphql';
import CategoryModel from '../models/category.model.js';
import ProductModel from '../models/product.model.js';
import throwCustomError,{ ErrorTypes } from '../helpers/error-handler.helper.js';

const categoryResolver = {
  Query: {
    getCategorys: async (_, { total }, contextValue) => {
      try {
        const products = await CategoryModel.find()
          .sort({ createdAt: -1 })
          .limit(total);
    
        return products;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getCategoryById: async (parent, { id }, contextValue) => {
      try {
        const product = await CategoryModel.findById(id);
        return product;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    createCategory: async (_, { input }, contextValue) => {
      try {
        const { name, description, price, image } = input;
        const {role} = contextValue.user;
        if (role == "USER") {
          throwCustomError(
            'USER are not allowed to Create Category',
            ErrorTypes.UNAUTHORIZED
          );
        }
        const isCategoryAlreadyExists = await CategoryModel.find({ name });
        if (isCategoryAlreadyExists.length > 0) {
          throwCustomError(
            'Category Name is already Registered',
            ErrorTypes.ALREADY_EXISTS
          );
        }
        // console.log(input);
        const categoryToCreate = new CategoryModel(input);
        const category = await categoryToCreate.save();

        return {
          success: true,
          message: 'Category Created successfully',
          category
        };
      } catch (error) { 
        throw new GraphQLError(error.message);
      }
    },

    updateCategory: async (_, { id, input }, contextValue) => {
      try {
        const {role} = contextValue.user
        if (role == 'USER') {
          throwCustomError(
            'USER are not allowed to Update Category',
            ErrorTypes.UNAUTHORIZED
          );
        }
        // Update Product
        const category = await CategoryModel.findOneAndUpdate({ id }, input, { new: true });
        console.log(category);
        return {
          success: true,
          message: 'Category Updated successfully',
          category
        };
      }catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    deleteCategory: async (_, { id }, contextValue) => { 
      try {
        // Delete Product
        const {role } = contextValue.user
        if (role == 'USER') {
          throwCustomError(
            'USER are not allowed to Delete Category',
            ErrorTypes.UNAUTHORIZED
          );
        }
        const category = await CategoryModel.findByIdAndDelete(id);
        console.log(category);
        return {
          success: category ? true : false,
          message: category ? 'Category deleted successfully' : 'Category not found',
          category: category ? category : null
        }
      } catch (error) { 
        throw new GraphQLError(error.message);
      }
    }
  },
  
  Category: {
    products: async (parent, args, contextValue) => {
      try {
        const { _id } = parent;
        console.log(parent)
        const products = await ProductModel.find({category: _id})
        return products;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
     }
  }
};

export default categoryResolver;
