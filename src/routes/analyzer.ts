import express, { Request, Response } from "express";
// import AccountController, { getAccountByUsername, getAllAccounts } from "./account.controller";
import MarketData, { IMarketData } from "../models/MarketData";
// import { getsAllCurrencyData } from "./marketData.controller";
import AccountManager from "../managers/AccountManager";
import e from "express";
import MarketDataManager from "../managers/MarketDataManager";

enum AnalyzerPath {
  Base = "/",
  ByUsername = "/:username",
}
export default class Analyzer {
  public router = express.Router();
  accountManager = new AccountManager();
  marketDataManager = new MarketDataManager();
  // accountControllerInstance = new AccountController();


  constructor() {
    this.setupRoutes();

  }

  setupRoutes() {

    // this.router.get(SellAnalyzerPath.ByUsername, this.getAccountsDataHandler.bind(this));
    // this.router.get(SellAnalyzerPath.ByUsername, this.getCurrencyDataHandler.bind(this));
    // this.router.get(AnalyzerPath.Base, this.getMarketDataTestApi.bind(this));
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
      if (!account) res.status(400).json({ message: "Account not found" });
      console.log("accountList is", account);
    } catch (error) {
      res &&
        res.status(400).json({ message: error.message });
    }

    // const currencyData = this.getCurrencyDataHandler();

  }

  async getCurrencyDataHandler() {

    let currencyData = undefined;
    // Getting the Currency data From DB
    try {
      currencyData = await this.marketDataManager.getMarketData();
      console.log("Currency saved data ", currencyData);
      if (!currencyData) {
        return;
      }

    } catch (error) {
      console.log("error is", error);
    }

    return currencyData;
  }


  // async  getMarketDataTestApi(req: Request, res: Response) {
  //   let marketData = undefined;
  //   try { 
  //     marketData = await this.marketDataManager.getMarketDataFromAPI();
  //     // console.log("Market data is", marketData);
  //     if (!marketData) {
  //       return;
  //     }
  //     res.status(200).send(marketData);
  //   }catch (error) {
  //     // console.error("error is", error);
  //     res.status(500).send(error);
  //   }

  // }


}
