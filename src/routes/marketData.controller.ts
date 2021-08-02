import express, { Request, Response } from "express";
import { IController, ICoinMarketCapCoin, ICoin } from "../types";
import axios, { AxiosRequestConfig } from "axios";
import cron from "node-cron";
import MarketData from "../models/MarketData";

const coinSymbols = ["BTC", "ETH", "DOGE", "ADA"];

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
      const coins: ICoin[] = coinsFromResponse.map((c: ICoinMarketCapCoin) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        total_supply: c.total_supply,
        last_updated: c.last_updated,
        quote: c.quote,
      }));

      //
      const newMarketData = new MarketData({
        date_added: new Date(),
        coins,
      });

      try {
        await newMarketData.save();
        console.log("added market data!");
      } catch (error) {
        console.error(error);
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

  async addMarketData(coins: ICoin[]) {
    const newMarketData = new MarketData({
      date_added: new Date(),
      coins,
    });

    try {
      await newMarketData.save();
      console.log("added market data!");
    } catch (error) {
      console.error(error);
    }
  }
}
