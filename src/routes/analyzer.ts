import express, { Request, Response } from "express";
import MarketData, { IMarketData } from "../models/MarketData";
import AccountManager from "../managers/AccountManager";
import MarketDataManager from "../managers/MarketDataManager";

enum AnalyzerPath {
  Base = "/",
  ByUsername = "/:username",
}
export default class Analyzer {
  public router = express.Router();
  accountManager = new AccountManager();
  marketDataManager = new MarketDataManager();


  constructor() {
    this.setupRoutes();

  }

  setupRoutes() {

    // this.router.get(SellAnalyzerPath.ByUsername, this.getAccountsDataHandler.bind(this));
    // this.router.get(SellAnalyzerPath.ByUsername, this.getCurrencyDataHandler.bind(this));
    
    // this.router.get(AnalyzerPath.Base, this.getMarketDataTestApi.bind(this));
  }

  public async analyze(req: Request, res: Response) {


  }


  // Getting the data related to accounts from data base
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

  }

  // Getting the Currency data From DB
  async getCurrencyDataHandler() {

    let currencyData = undefined;
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
