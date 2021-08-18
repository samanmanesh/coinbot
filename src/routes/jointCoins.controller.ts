import express, { Request, Response } from "express";
import { ICoins } from "../models/jointCoins";
import JointCoinsManager from "../managers/JointCoinsManager";

enum RouteNames {
  Base = "/",
  BySymbol = "/:symbol",
  BySymbolAndUsername = "/:symbol/:username"
}

export default class CommonCoinsController {
  public router = express.Router();
  jointCoinsManager = new JointCoinsManager();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post(RouteNames.Base, (req: Request, res: Response) => this.addNewCommonCoin(req, res));

    this.router.get(RouteNames.Base, (req: Request, res: Response) => this.getAllCommonCoins(req, res));

    this.router.get(RouteNames.BySymbol, (req: Request, res: Response) => this.getCommonCoin(req, res));

    this.router.delete(RouteNames.BySymbol, (req: Request, res: Response) => this.deleteCommonCoin(req, res));

    this.router.delete(RouteNames.BySymbolAndUsername, (req: Request, res: Response) => this.deleteAccountFromCoin(req, res));

    this.router.put(RouteNames.BySymbol, (req: Request, res: Response) => this.updateCommonCoin(req, res));

    // this.router.patch(RouteNames.BySymbolAndUsername, (req: Request, res: Response) => this.updateCommonCoinAccount(req, res));

    this.router.patch(RouteNames.BySymbolAndUsername, (req: Request, res: Response) => this.addAccountToCommonCoinsAccounts(req, res));
  }

  async addNewCommonCoin(req: Request, res: Response) {

    const newCoin: ICoins = {
      coinName: req.body.coinName,
      coinSymbol: req.body.coinSymbol,
      accounts: []
    }

    try {
      const savedNewCoin = await this.jointCoinsManager.createJointCoin(newCoin);
      res.status(200).send(savedNewCoin);

    } catch (error) {

      res.status(400).json({ message: error.message });
    }
  }


  async getAllCommonCoins(req: Request, res: Response) {

    try {
      const allCommonCoins = await this.jointCoinsManager.getJointCoins();
      res.status(200).send(allCommonCoins);

    } catch (error) {

      res.status(400).json({ message: error.message });
    }

  }


  async getCommonCoin(req: Request, res: Response) {

    try {
      const commonCoin = await this.jointCoinsManager.getJointCoin(req.params.symbol);
      res.status(200).send(commonCoin);

    } catch (error) {

      res.status(400).json({ message: error.message });
    }
  }


  async deleteCommonCoin(req: Request, res: Response) {
    try {
      const deletedCoin = await this.jointCoinsManager.deleteJointCoin(req.params.symbol);
      res.status(200).send(deletedCoin);

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  

  async updateCommonCoin(req: Request, res: Response) {

    try {
      const updatedCoin = await this.jointCoinsManager.updateJointCoin(req.params.symbol, req.body);
      res.status(200).send(updatedCoin);

    } catch (error) {

      res.status(400).json({ message: error.message });
    }

  }


  async deleteAccountFromCoin(req: Request, res: Response) {
    try {
      await this.jointCoinsManager.removeAccountFromJointCoin(req.params.symbol, req.params.username);
      res.status(200).send({ message: "Account removed from coin" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


  // async updateCommonCoinAccount(req: Request, res: Response) {

  //   try {
  //     await this.jointCoinsManager.addAccountToJointCoin(req.params.symbol, req.params.username);
  //     res.sendStatus(200)

  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // }

  async addAccountToCommonCoinsAccounts(req: Request, res: Response) {

    try {
      const addedAccount = await this.jointCoinsManager.addAccountToJointCoinsAccounts(req.params.symbol, req.params.username);
      res.status(200).send(addedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  }

}