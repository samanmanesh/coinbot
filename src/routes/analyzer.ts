import AnalyzerManager from '../managers/AnalyzerManager';
import express, { Request, Response } from "express";
import AccountManager from "../managers/AccountManager";
import MarketDataManager from "../managers/MarketDataManager";
import { IAccount } from "../models/Account";


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
    // console.debug('ANALYZER:', users, data);
    // console.debug('BTC is', data.BTC);
    // console.debug('ADA is', data.ADA);
    console.table(data);
    // console.log(users);

    for (let coin in users) {
      console.log(coin, 'coin');

      for (let user in users[coin]) {
        // console.log(user,'index');
        console.log(users[coin][user]);

        let userData = users[coin][user].assets.coins.find(coins => coins.symbol === coin);

        console.log("for symbol", coin, " he bought at", users[coin][user].assets.coins.find(coins => coins.symbol === coin)?.buy_at);
        console.log(userData, 'userData');

        console.log("Current Price of" + coin + " is", data[coin]);

        if (userData && userData?.buy_at > data[coin]) {
          console.log("User", user, "is losing money on", coin);
          console.log("It must go for stop loss percent to check if sell or keep the coin");

        }
        if (userData && userData?.buy_at < data[coin]) {
          console.log("User", user, " gains money on", coin);
          console.log("It must go for profit percent to check if sell or keep the coin");

        }

      }

    }

  }




  //Todo 1> We want to compare the price here 
  //Todo 2> analyze gets the price each time cron works/  meanwhile we want to pass it to a function or method to :
  //todo:  first go though each coin for each accounts and then compare the price. 
  //todo: So if the price is more than 30% on n% of bought price, sell that coin. 
  //todo: if the price is sold in high we have to look for lower price to but it for that account.  

}
