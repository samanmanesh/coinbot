import express, { Application, Request, Response } from "express";
import CoinBotContext from "../context/CoinBotContext";
import { IRoute } from "../types";

export default class App {
  public app: Application = express();
  private _context: CoinBotContext = new CoinBotContext();

  constructor(routes: IRoute[]) {


    this.setupMiddleware();
    this.setupRoutes(routes);
    this.app.get("/", (req: Request, res: Response) => {
      res.send(`'Hello world'`);
    });
    this.app.get("/play", this.setupCron.bind(this));
    // this.setupCron();
  }

  public listen(port: number) {
    this.app.listen(port, () =>
      console.log(`App is listening on port ${port}`)
    );
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.app.use(route.path, route.controller.router);
    });
  }

  public async setupCron(req: Request, res: Response) {
    try {
    await this._context.runCron();
    res.status(200).send("Cron is running");}
    catch(err) { 
      console.error({message: err});
    }
  }
}
