import express, { Application, Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import accounts from "./routes/accounts";
import AccountController from "./routes/account.controller";
import { IRoute } from "./types";
import App from "./app/index";
dotenv.config();

const routes: IRoute[] = [
  {
    path: "/accounts",
    controller: new AccountController(),
  },
];

const app = new App(routes);
app.listen(3000);

// const app: Application = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/accounts", accountsRoute);

// const setupMongoose = () => {
// try {
//   mongoose.connect(
//     process.env.DB_CONNECTION_URI ?? "",
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => console.log("Connected to the DB")
//   );
// } catch (e) {
//   console.log("could not connect");
// }
// };

// setupMongoose();

// app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
