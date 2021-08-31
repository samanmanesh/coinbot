import express, { Application, Request, Response } from "express";
import CoinBotContext from "../context/CoinBotContext";
import { IRoute } from "../types";
export default class App {
  public app: Application = express();
  private _context: CoinBotContext = new CoinBotContext();
  
  constructor(routes: IRoute[]) {
    this.setupMiddleware();
    this.setupRoutes(routes);
    this.setupCron();
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

  setupCron() {
    this._context.runCron();
  }
}
