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

  public async analyze(users: Record<string, IAccount[]>, data: any) {
    console.table(data);
    // console.log(users);

    for (let coin in users) {
      // console.log(coin, 'coin');
      for (let user in users[coin]) {
        // console.log(user,'index');
        console.log(users[coin][user]);
        let userData = users[coin][user].assets.coins.find(coins => coins.symbol === coin);
        
        if (userData) {

          console.log('userData', userData);

          console.log("for symbol", coin, " he bought at", users[coin][user].assets.coins.find(coins => coins.symbol === coin)?.bought_at);

          console.log("Current Price of" + coin + " is ", data[coin]);


          // LOGICS
          // if (userData.bought_at > data[coin]) {
          //   console.log("User", user, "is losing money on", coin);

          // }
          // if (userData.bought_at < data[coin]) {
          //   console.log("User", user, " gains money on", coin);
          // }
          // Gets the risk data 

          const riskMargins: IRiskMargins = this.riskManagement(userData?.bought_at, userData?.sold_at);

          // Order handler
          console.log("if reach the new buy position, buy/ use limit order to buy for us  ")

          //sell time 
          if (riskMargins.profitMargin !== 0){
            this.orderHandler(riskMargins.profitMargin, userData.volume);
          }

          //sell time
          if (riskMargins.profitMargin !== 0 && data[coin] >= riskMargins.profitMargin) {

            // if we want to sell all having volume we can call the volumeCalculator to get the current volume for selling and then send that with limit  

            //if reach to profitMargin sell/ use limit order to sell for us"

            const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at);


            // this.orderHandler(userData.bought_at, userData.volume, userData.sold_at)

          }

          //Buy time
          if (riskMargins.newBuyPosition !== 0 && data[coin] <= riskMargins.newBuyPosition) {
            const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at)
          }


          // console.log(this.riskManagement(userData?.bought_at, userData?.sold_at));

          //volume 
          // userData &&
          //   this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at);
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

      // We are looking for sell with profit
      profitMargin = boughtPrice + (boughtPrice * sellProfitMargin);
      // console.log("if reach to profitMargin sell/ use limit order to sell for us");
      // return profitMargin;
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

  private orderHandler(limitPrice: number, volume: number, ) {
    // use binance Api 

    //for now we use accountManager to update data

  }

  
}
