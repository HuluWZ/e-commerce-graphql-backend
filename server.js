// convert all the above to import statements
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import allTypeDefs from './schemas/index.schema.js';
import allResolvers from './resolvers/index.resolver.js';
import context from './context/context.js';
import * as dotenv from 'dotenv';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';

dotenv.config();

const server = new ApolloServer({
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  includeStacktraceInErrorResponses: false, 
  introspection: true,
  plugins: [process.env.NODE_ENV === "production" ?
    ApolloServerPluginLandingPageProductionDefault({ embed: true, graphRef: "plaid-gufzoj@current" }) :
    ApolloServerPluginLandingPageLocalDefault({ embed: true })
 ]

});

const mongoDB_URL = process.env.MONGODB_URL;

mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB..');
    return startStandaloneServer(server, {
      listen: { port: process.env.PORT },
      context: context,
    });
  })
  .then((server) => {
    console.log(`🚀  Server ready at: ${server.url}`);
  });
