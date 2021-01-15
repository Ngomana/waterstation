// import cors from "cors";
import "dotenv/config";
import "reflect-metadata";
import { connect } from "mongoose";
import express from "express";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { StationResolver } from "./resolvers/station";
import cors from "cors";
// import { mongoDbConnectionString } from "./types";

(async () => {
  //applying cors for security concerns
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: false,
      allowedHeaders: "*",
    })
  );

  //protecting database and server

  //connection to database
  try {
    const port = 8000;
    await connect(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Water",
      useFindAndModify: false,
    });

    //connection to server side
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver, StationResolver],
      }),
      context: ({ req, res }) => ({ req, res }),
    });

    //applying middleware
    apolloServer.applyMiddleware({
      app,
      cors: true,
    });

    app.listen(port, () => {
      console.log(
        `Apollo server & mongodb running on port http://localhost:${port}/graphql`
      );
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
  //connection to server
})();
