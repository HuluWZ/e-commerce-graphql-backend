import { GraphQLError } from 'graphql';
import UserModel from '../models/user.model.js';
import ReviewModel from '../models/review.model.js';
import userHelper from '../helpers/user.helper.js';
import throwCustomError,{ ErrorTypes } from '../helpers/error-handler.helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


const userResolver = {
  Query: {
    getUsers: async (_, { total }, contextValue) => {
      try {
        const users = await UserModel.find()
          .sort({ createdAt: -1 })
          .limit(total);
      
        return users;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUserById: async (parent, { id }, contextValue) => {
      try {
        const user = await UserModel.findById(id);
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {

    signup: async (_, { input }) => {
      const { email, password, firstName, lastName, role } = input;
      const isUserExists = await userHelper.isEmailAlreadyExist(email);
      if (isUserExists) {
        throwCustomError(
          'Email is already Registered',
          ErrorTypes.ALREADY_EXISTS
        );
      }
      const hashedPassword = await bcrypt.hash(password, 8);
      const userToCreate = new UserModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });
      const user = await userToCreate.save();
      const token = jwt.sign(
        { userId: user._id, email: user.email,role: user.role },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.TOKEN_EXPIRY_TIME }
      );

      return {
        __typename: 'UserWithToken',
        ...user._doc,
        userJwtToken: {
          token: token,
        },
      };
    },

    login: async (_, { input: { email, password } }, context) => {
      const user = await UserModel.findOne({ email: email });
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (user && isPasswordMatched) {
        const token = jwt.sign(
          { userId: user._id, email: user.email,role: user.role },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: process.env.TOKEN_EXPIRY_TIME }
        );
        return {
          ...user._doc,
          userJwtToken: {
            token: token,
          },
        };
      }
      throwCustomError(
        'Invalid email or password entered.',
        ErrorTypes.BAD_USER_INPUT
      );
    },

    updateUser: async (_, { id, input }) => {
      var hashedPassword;
      if (input.hasOwnProperty('password')) {
        hashedPassword = await bcrypt.hash(input.password, 8);
        input.password = hashedPassword;
      }
      const user = await UserModel.findOneAndUpdate({ id },input,{new:true});
      // console.log(user)
      return {
        success: true,
        message: 'User updated successfully',
        user: user
      };
    },
    deleteUser: async (_, { id }) => {
      const user = await UserModel.findByIdAndDelete(id);
      // console.log(user)
      return {
        success: user ? true : false,
        message: user? 'User deleted successfully':'User not found',
        user: user? user:null
      }
    }
  },
  User: {
    reviews: async (parent, args, context) => {

      try {
        const { id } = parent;
        const reviews = await ReviewModel.find({ user: id });
        return reviews;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    }
  }
};

export default userResolver;
