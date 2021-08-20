import  AnalyzerManager  from '../managers/AnalyzerManager';
import express, { Request, Response } from "express";
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
  analyzerManager = new AnalyzerManager();

  constructor() {
    this.setupRoutes();

  }

  setupRoutes() {

    // this.router.get(SellAnalyzerPath.ByUsername, this.getAccountsData.bind(this));
    // this.router.get(SellAnalyzerPath.ByUsername, this.getCurrencyData.bind(this));

    // this.router.get(AnalyzerPath.Base, this.getMarketDataTestApi.bind(this));
  }

  public async analyze(req: Request, res: Response) {


  }



  async getPreferredCoinsData(req: Request, res: Response) {
    let account = undefined;
    let currencyData = undefined;
    let preferredCoinsData = undefined;

    try {

      account = await this.getAccountsData(req, res);

    } catch (error) {
      console.error("error is", error);
    }


    try { 
      currencyData = await this.getCurrencyData();
    } catch (error) { 
      console.error("error is", error);
    }

    if (!account || !currencyData) {
      return;
    }

    // try {
    //   preferredCoinsData = await this.analyzerManager.preferredCoinsHandler(account, currencyData);
    //   console.log("preferredCoinsData is", preferredCoinsData);
    // } catch (error) {
    //   console.log("error is", error);
    // }

    return preferredCoinsData;

  }

  // Getting the data related to accounts from data base
  async getAccountsData(req: Request, res: Response) {

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
    return account;
  }

  // Getting the Currency data From DB
  async getCurrencyData() {

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