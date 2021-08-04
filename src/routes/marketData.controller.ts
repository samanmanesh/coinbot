import express, { Request, Response } from "express";
import { IController, ICoinMarketCapCoin, ICoinData } from "../types";
import axios, { AxiosRequestConfig } from "axios";
import cron from "node-cron";
import MarketData, { IMarketData } from "../models/MarketData";

// const coinSymbols = ["BTC", "ETH", "DOGE", "ADA"];

enum MarketDataPath {
  Base = "/",
}

export default class MarketDataController implements IController {
  public router = express.Router();

  constructor() {
    this.setupRoutes();
    // this.setupCronJobs();
  }

  setupCronJobs() {
    cron.schedule("* * * * *", () => this.getMarketData());
  }

  setupRoutes() {
    this.router.get(MarketDataPath.Base, this.getMarketData);
  }

  async getMarketData(req?: Request, res?: Response) {
    const config: AxiosRequestConfig = {
      params: {
        start: 1,
        limit: 10,
        convert: "CAD",
      },
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
      },
    };
    try {
      const { data } = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        config
      );
      const coinsFromResponse: ICoinMarketCapCoin[] = data.data;
      const coins: ICoinData[] = coinsFromResponse.map(
        (c: ICoinMarketCapCoin) => ({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          total_supply: c.total_supply,
          last_updated: c.last_updated,
          quote: c.quote,
        })
      );

      //
      const newMarketData: IMarketData = {
        date_added: new Date(),
        coins,
      };

      //Todo must check if there is any data update that one if not should make a new one`

      // Added the Data to DB
      // try {
      //   await MarketData.save(newMarketData);
      //   console.log("added market data!");
      // } catch (error) {
      //   console.error(error);
      // }

      

      // Update the existing the data
      try {
        await MarketData.update({}, newMarketData);
        console.log("updated market data!");
      } catch (error) {
        console.error(error);
      }

      // Getting the Data From DB
      try {
        const newSavedData = await MarketData.find();
        res && res.status(201).json(newSavedData);
      } catch (error) {
        res && res.status(400).json({ message: error.message });
      }

      //
      // await this.addMarketData(coins);
    } catch (err) {
      console.error(err);
    }
    res &&
      res.send({
        message: "Got market data!!!",
      });
  }

}
