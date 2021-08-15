import express, { Request, Response } from "express";
import { ICoins } from "../models/jointCoins";
import JointCoinsManager from "../managers/JointCoinsManager";

enum RouteNames {
  Base = "/"
}

export default class CommonCoinsController {
  public router = express.Router();
  jointCoinsManager = new JointCoinsManager();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post(RouteNames.Base, (req: Request, res: Response) => this.addNewCommonCoin(req, res));

  }

  async addNewCommonCoin(req: Request, res: Response) {

    const newCoin : ICoins = {
      coinName: req.body.coinName,
      accounts: req.body.accounts
    }

    try {
      const savedNewCoin = await this.jointCoinsManager.createJointCoin(newCoin);
      res.status(200).send(savedNewCoin);

     } catch (error) {

      res.status(400).json({ message: error.message });
    }
  }

}