import express, { Request, Response } from "express";
import { IController } from "../types";
import App from "../app/index";
import AccountController, { getAllAccounts } from "./account.controller";
import { IAccount } from "../models/Account";

enum SellAnalyzerPath {
  Base = "/",
}
export default class SellAnalyzer {
  public router = express.Router();

  // accountControllerInstance = new AccountController();


  constructor() {
    this.setupRoutes();

  }

  setupRoutes() {

    this.router.get(SellAnalyzerPath.Base, this.analyze);
  }

  public async analyze(req: Request, res: Response) {
    // throw new Error("Not implemented.");

    //Todo first gets the data related to accounts from data base
    try {
      // const accountsList = await this.accountControllerInstance.   getAllAccounts();
      const accountList = await getAllAccounts();
      res.status(200).json(accountList);
      console.log("acccountList is", accountList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }


    //Todo then gets the data for preferred_coins for each account from the data base




  }
}

