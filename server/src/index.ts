// import express from "express";
// import cors from "cors";
import { connect } from "mongoose";
import { mongoDbConnectionString } from "./types";

(async () => {
  //applying cors for security concerns
  //   const app = express();
  //   app.use(
  //     cors({
  //       origin: "http://localhost:4000",
  //       credentials: true,
  //     })
  //   );

  //protecting database and server

  //connection to database
  try {
    await connect(
      "mongodb+srv://tony:213580@numberscloud.fak0z.mongodb.net/water?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // dbName: 'Water',
        // useFindAndModify: false,
      }
    );
    console.log(`You are now connected to water database`);
  } catch (error) {
    console.log(error);
    throw error;
  }
  //connection to server
})();
