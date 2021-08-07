import express, { Request, Response } from "express";
import { IController} from "../types";
import cron from "node-cron";
import MarketDataManager from '../managers/MarketDataManager';

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
    this.router.get(MarketDataPath.Base, this.refreshMarketData);
  }

  async refreshMarketData(req?: Request, res?: Response) {
    // const marketData = await this.marketDataManager.getMarketData();
    const marketData = await this.marketDataManager.getMarketDataFromAPI();
    if (!marketData) {
      res && res.status(500).json({ message: "No data found" });
      return;
    }
    await this.marketDataManager.updateMarketData(marketData);


    
    //   //Todo must check if there is any data update that one if not should make a new one`

      }

}
