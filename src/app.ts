import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import accountsRoute from './routes/accounts';
// import bodyParser from 'body-parser';

dotenv.config();
const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/accounts", accountsRoute);

const setupMongoose = () => {
  try {
    mongoose.connect(
      process.env.DB_CONNECTION_URI ?? "",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Connected to the DB")
    );
  } catch (e) {
    console.log("could not connect");
  }
};

setupMongoose();

app.get("/", (req: Request, res: Response) => {
  res.send(`'Hello world'`);
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
