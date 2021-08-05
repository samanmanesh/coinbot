import express, { Request, Response } from "express";
import AccountController, { getAccountByUsername, getAllAccounts } from "./account.controller";
import MarketData, { IMarketData } from "../models/MarketData";
import { getsAllCurrencyData } from "./marketData.controller";
import AccountManager from "../managers/AccountManager";
import e from "express";
import MarketDataManager from "../managers/MarketDataManager";

enum SellAnalyzerPath {
  Base = "/",
  ByUsername = "/:username",
}
export default class SellAnalyzer {
  public router = express.Router();
  accountManager = new AccountManager();
  marketDataManager = new MarketDataManager();
  // accountControllerInstance = new AccountController();


  constructor() {
    this.setupRoutes();

  }

  setupRoutes() {

    this.router.get(SellAnalyzerPath.ByUsername, this.getAccountsDataHandler);
    // this.router.get(SellAnalyzerPath.ByUsername, this.gettingCurrencyDataHandler);
  }

  public async analyze(req: Request, res: Response) {

    //Todo first gets the data related to accounts from data base
    // this.gettingAccountsDataHandler(req , res);
    // try {
    //   const accountList = await getAccountByUsername(req, res);
    //   res &&
    //     res.status(200).json(accountList);
    //   console.log("acccountList is", accountList);
    // } catch (error) {
    //   res &&
    //     res.status(400).json({ message: error.message });
    // }


    // try {
    //   const accountList = await getAllAccounts();
    //   res.status(200).json(accountList);
    //   console.log("acccountList is", accountList);
    // } catch (error) {
    //   res.status(400).json({ message: error.message });
    // }


    //Todo then gets the data for preferred_coins for each account from the data base

    // Getting the Data From DB
    // this.gettingCurrencyDataHandler(res);

    // try {
    //   const coinsSavedData = await getsAllCurrencyData();
    //   console.log("Coins saved data ", coinsSavedData)
    //   res.status(200).json(coinsSavedData);
    // } catch (error) {
    //   res.status(400).json({ message: error.message });
    // }

  }


  async getAccountsDataHandler(req: Request, res: Response) {
    let account = undefined;
    const { username } = req.params;
    try {
      account = await this.accountManager.getAccount(username);
      res &&
        res.status(200).json(account);
      console.log("acccountList is", account);
    } catch (error) {
      res &&
        res.status(400).json({ message: error.message });
    }

    const currencyData = this.getCurrencyDataHandler();
    console.log("Coins saved data ", currencyData);

  }

  async getCurrencyDataHandler() {
    console.log("gettingCureencyData is read");
    let currencyData = undefined;
    // Getting the Currency data From DB
    currencyData = await getsAllCurrencyData();
    // console.log("Coins saved data ", currencyData);
    // try {
    // } catch (error) {
    //   console.log("error is", error);
    // }

    return currencyData;
  }


}
