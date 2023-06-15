import jwt from 'jsonwebtoken';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';

const getUser = async (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const context = async ({ req, res }) => {
  //   console.log(req.body.operationName);
  const {operationName} = req.body;
  if (operationName === 'IntrospectionQuery') {
    return {};
  }

  // allowing the 'Signup' and 'Login' queries to pass without giving the token
  if (
    ['Signup','Login','UpdateUser','DeleteUser'].includes(operationName) ||
    ['GetUserById', 'GetUsers'].includes(operationName) ||
    ['GetProductById', 'GetProducts'].includes(operationName) ||
    ['GetCategoryById', 'GetCategorys', 'CreateCategory'].includes(operationName) ||
    ['CreateReview', 'GetReviewById', 'GetReviews', 'UpdateReview', 'DeleteReview'].includes(operationName) ||
    ['CreateCart', 'GetCartById', 'GetCarts','UpdateCart','DeleteCart'].includes(operationName) 

   ){
    return {};
  }

  // get the user token from the headers
  const token = req.headers.authorization || '';

  // Try To Retrieve a User with The Token
  const user = await getUser(token);
  // console.log(" User :  ",user)
  
  if (!user) {
    throwCustomError('User is not Authenticated', ErrorTypes.UNAUTHENTICATED);
  }

  console.log(" Welcome ",user)
  // add the user to the context
  return { user };
};

export default context;
