import AnalyzerManager from '../managers/AnalyzerManager';
import express, { Request, Response } from "express";
import AccountManager from "../managers/AccountManager";
import MarketDataManager from "../managers/MarketDataManager";
import { IAccount } from "../models/Account";
import { IRiskMargins } from '../types';


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
    // this.router.get(AnalyzerPath.Base, this.getMarketDataTestApi.bind(this));
  }

  public async analyze(coinAccounts: Record<string, IAccount[]>, data: any) {
    console.table(data);
    console.log(coinAccounts);
    //  await this.riskPriceManager(); 

    for (let coin in coinAccounts) {
      console.log(coin, 'coin');
      for (let user in coinAccounts[coin]) {
        // console.log(user,'index');
        // console.log(users[coin][user], 'user');
        let userData = coinAccounts[coin][user].assets.coins.find(coins => coins.symbol === coin);

      
        if (userData) {

          // console.log('userData', userData);

          // console.log("for symbol", coin, " he bought at", users[coin][user].assets.coins.find(coins => coins.symbol === coin)?.bought_at);

          // console.log("Current Price of" + coin + " is ", data[coin]);


          // LOGICS
          // if (userData.bought_at > data[coin]) {
          //   console.log("User", user, "is losing money on", coin);

          // }
          // if (userData.bought_at < data[coin]) {
          //   console.log("User", user, " gains money on", coin);
          // }
          // Gets the risk data 

          const riskMargins: IRiskMargins = this.riskManagement(userData?.bought_at, userData?.sold_at);

          //ORDER Handler
          //sell time 
          if (userData.bought_at !== 0 && riskMargins.profitMargin !== 0) {
            // const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at);

            this.orderHandler(riskMargins.profitMargin, userData.volume);
          }

          //Buy time
          if (userData.sold_at !== 0 && riskMargins.newBuyPosition !== 0) {
            //   const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at)

            this.orderHandler(riskMargins.newBuyPosition, userData.volume);
          }

          //   // if we want to sell all having volume we can call the volumeCalculator to get the current volume for selling and then send that with limit  

          //   //if reach to profitMargin sell/ use limit order to sell for us"

          //   // this.orderHandler(userData.bought_at, userData.volume, userData.sold_at)

        }
      }

    }

  }

  private riskManagement(boughtPrice: number, soldPrice: number) {

    //temporary give it the stop loss percent till it receive it from user and 
    // const sellStopLossPercent = 0.15; //15%
    // const buyProfitMargin = 0.30; //30%

    const sellProfitMargin = 0.20; //20%
    const buyPositionPercent = 0.10; //10%

    let profitMargin = 0;
    let newBuyPosition = 0;

    // checks if we bought or sold the coin
    //bought_at 
    if (boughtPrice !== 0) {
      profitMargin = boughtPrice + (boughtPrice * sellProfitMargin);
    }

    //sold_at 
    if (soldPrice !== 0) {

      // We are looking for buy new coin in lower price
      newBuyPosition = boughtPrice - (boughtPrice * buyPositionPercent);
      // console.log("if reach the new buy position, buy/ use limit order to buy for us  ")
      // return newBoughtPosition;
    }
    return ({ profitMargin, newBuyPosition });
  }

  private volumeCalculator(currentPrice: number, volume: number, boughtPrice: number) {
    const currentVolume = (currentPrice * volume) / boughtPrice;
    console.log("currentVolume is", currentVolume);
    return currentVolume;
  }

  private orderHandler(limitPrice: number, volume: number,) {
    // use binance Api 

    //for now we use accountManager to update data

  }

  private async riskPriceManager (){


    // we want the assets.coins.allocated_price
    //todo we want to spread the deposit to all holding coins"assets.coins"(for now instead of prefer coins) 


  }
}
