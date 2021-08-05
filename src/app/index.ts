import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import { IRoute } from "../types";
export default class App {
  public app: Application = express();

  constructor(routes: IRoute[]) {
    this.setupMiddleware();
    this.setupRoutes(routes);
    // this.setupMongoose();

    this.app.get("/", (req: Request, res: Response) => {
      res.send(`'Hello world'`);
    });
  }

  public listen(port: number) {
    this.app.listen(port, () =>
      console.log(`App is listening on port ${port}`)
    );
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.app.use(route.path, route.controller.router);
    });
  }

  setupMongoose() {
    try {
      mongoose.connect(
        process.env.DB_CONNECTION_URI ?? "",
        // { useNewUrlParser:  useUnifiedTopology: true },
        () => console.log("Connected to the DB")
      );
    } catch (e) {
      console.log("could not connect");
    }
  }
}
