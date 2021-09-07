"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyzerManager_1 = __importDefault(require("../managers/AnalyzerManager"));
const express_1 = __importDefault(require("express"));
const AccountManager_1 = __importDefault(require("../managers/AccountManager"));
const MarketDataManager_1 = __importDefault(require("../managers/MarketDataManager"));
var AnalyzerPath;
(function (AnalyzerPath) {
    AnalyzerPath["Base"] = "/";
    AnalyzerPath["ByUsername"] = "/:username";
})(AnalyzerPath || (AnalyzerPath = {}));
class Analyzer {
    constructor() {
        this.router = express_1.default.Router();
        this.accountManager = new AccountManager_1.default();
        this.marketDataManager = new MarketDataManager_1.default();
        this.analyzerManager = new AnalyzerManager_1.default();
        this.setupRoutes();
    }
    setupRoutes() {
        // this.router.get(AnalyzerPath.Base, this.getMarketDataTestApi.bind(this));
    }
    analyze(coinAccounts, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.table(data);
            console.log(coinAccounts);
            //  await this.riskPriceManager(); 
            for (let coin in coinAccounts) {
                console.log(coin, 'coin');
                for (let user in coinAccounts[coin]) {
                    // console.log(user,'index');
                    // console.log(users[coin][user], 'user');
                    let userData = coinAccounts[coin][user].assets.coins.find(coins => coins.symbol === coin);
                    let userAssetDeposit = coinAccounts[coin][user].assets.wallet.deposit;
                    console.log("wallet", userAssetDeposit);
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
                        const riskMargins = this.riskManagement(userData === null || userData === void 0 ? void 0 : userData.bought_at, userData === null || userData === void 0 ? void 0 : userData.sold_at);
                        //ORDER Handler
                        //sell time 
                        if (riskMargins.profitMargin !== 0) {
                            // const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at);
                            this.orderHandler(riskMargins.profitMargin, userData.volume);
                        }
                        //Buy time
                        if (riskMargins.newBuyPosition !== 0) {
                            //   const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at)
                            this.orderHandler(riskMargins.newBuyPosition, userData.volume);
                        }
                        // //sell time
                        // if (riskMargins.profitMargin !== 0 && data[coin] >= riskMargins.profitMargin) {
                        //   // if we want to sell all having volume we can call the volumeCalculator to get the current volume for selling and then send that with limit  
                        //   //if reach to profitMargin sell/ use limit order to sell for us"
                        //   const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at);
                        //   // this.orderHandler(userData.bought_at, userData.volume, userData.sold_at)
                        // }
                        //Buy time
                        // if (riskMargins.newBuyPosition !== 0 && data[coin] <= riskMargins.newBuyPosition) {
                        //   const volume = this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at)
                        // }
                    }
                }
            }
        });
    }
    riskManagement(boughtPrice, soldPrice) {
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
    volumeCalculator(currentPrice, volume, boughtPrice) {
        const currentVolume = (currentPrice * volume) / boughtPrice;
        console.log("currentVolume is", currentVolume);
        return currentVolume;
    }
    orderHandler(limitPrice, volume) {
        // use binance Api 
        //for now we use accountManager to update data
    }
    riskPriceManager() {
        return __awaiter(this, void 0, void 0, function* () {
            // we want the assets.wallet.deposit 
            // the number of assets.coins
            //todo we want to spread the deposit to all holding coins"assets.coins"(for now instead of prefer coins) 
        });
    }
}
exports.default = Analyzer;
