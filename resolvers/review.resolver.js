import { GraphQLError } from 'graphql';
import ReviewModel from '../models/review.model.js';
import ProductModel from '../models/product.model.js';
import UserModel from '../models/user.model.js';
import throwCustomError,{ ErrorTypes } from '../helpers/error-handler.helper.js';

const reviewResolvers = {
  Query: {
    getReviews: async (_, { total }, contextValue) => {
      try {
        const reviews = await ReviewModel.find().sort({ createdAt: -1 }).limit(total);    
        return reviews;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getReviewById: async (parent, { id }, contextValue) => {
      try {
        const review = await ReviewModel.findById(id)
        return review;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    createReview: async (_, { input }, contextValue) => {
      try {
        const { user, product, rating, message } = input;
        // const {role} = contextValue.user;
        // if (role == "ADMIN") {
        //   throwCustomError(
        //     'ADMIN are not allowed to Write Review',
        //     ErrorTypes.UNAUTHORIZED
        //   );
        // }
        
        // console.log(input);
        const reviewToCreate = new ReviewModel(input);
        const review = await reviewToCreate.save();

        return {
          success: true,
          message: 'Review Added successfully',
          review
        };
      } catch (error) { 
        throw new GraphQLError(error.message);
      }
    },

    updateReview: async (_, { id, input }, contextValue) => {
      try {
        // const {role} = contextValue.user
        // if (role == 'ADMIN') {
        //   throwCustomError(
        //     'ADMIN are not allowed to Update Review',
        //     ErrorTypes.UNAUTHORIZED
        //   );
        // }
        // Update Product
        const review = await ReviewModel.findOneAndUpdate({ id }, input, { new: true });
        return {
          success: true,
          message: 'Review Updated successfully',
          review
        };
      }catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    deleteReview: async (_, { id }, contextValue) => { 
      try {
        // Delete Product
        // const {role } = contextValue.user
        // if (role == 'ADMIN') {
        //   throwCustomError(
        //     'ADMIN are not allowed to Delete Review',
        //     ErrorTypes.UNAUTHORIZED
        //   );
        // }
        const review = await ReviewModel.findByIdAndDelete(id);
        return {
          success:true,
          message: "Review Deleted Successfully",
          review
        }
      } catch (error) { 
        throw new GraphQLError(error.message);
      }
    }
  },
  
  Review: {
    product: async (parent, args, contextValue) => {
      try {
        const product = await ProductModel.findById(parent.product)
        return product;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent, args, contextValue) => {
      const user = await UserModel.findById(parent.user)
      return user
    }
  }
};

export default reviewResolvers;
