import express, { Request, Response } from "express";
import { IController } from "../types";
import cron from "node-cron";
import MarketDataManager from '../managers/MarketDataManager';
import { RSA_NO_PADDING } from "constants";

enum MarketDataPath {
  Base = "/",
}



export default class MarketDataController implements IController {
  public router = express.Router();
  marketDataManager = new MarketDataManager();
  constructor() {
    this.setupRoutes();
    // this.setupCronJobs();
  }

  setupCronJobs() {
    cron.schedule("* * * * *", () => this.refreshMarketData());
  }

  setupRoutes() {
    this.router.get(MarketDataPath.Base, (req, res) => this.refreshMarketData(req, res));
  }
  
  async refreshMarketData(req?: Request, res?: Response) {
    let marketDataFromApi = undefined;
    // let updatedMarketData = undefined;
  
    try {
      marketDataFromApi = await this.marketDataManager.getMarketDataFromAPI();
    } catch (error) {
      console.error('Failed to get market data from API', error);
    }

    if (!marketDataFromApi) {
      return;
    }
    
    try {
      await this.marketDataManager.updateMarketData(marketDataFromApi);
    } catch (error) {
      console.error('Failed to put market data into DB', error);
    }

    res && res.sendStatus(200);

   
  }



  // try {
  //   marketDataFromDB = await this.marketDataManager.getMarketData();
  //   if (marketDataFromDB === undefined)
  //     throw new Error("No data found");
  //   res && res.status(200).json(marketDataFromDB);
  // } catch (error) {
  //   res && res.status(500).json({ message: "Error getting market data from DB" });
  //   throw new Error("No data found");
  // }

  //   //Todo must check if there is any data update that one if not should make a new one`

}


