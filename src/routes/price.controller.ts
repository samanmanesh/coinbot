import express, { Request, Response } from "express";
import { IController } from "../types";
import PriceManager from "../managers/PriceManager";



export default class PriceController implements IController {
  public router = express.Router();
  BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
  SELECTOR = '.showPrice';
  // priceManager = new PriceManager(this.BINANCE_URL,this.SELECTOR);
  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get("/", this.getPrices.bind(this));
  }
  getPrices = async (req: Request, res: Response) => {
    try {
    // const prices = await this.priceManager.interval();
    // res.send(prices);
    } catch (error) { 
      res.status(500).send(error);
    }
  }
  
}