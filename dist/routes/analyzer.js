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
    analyze(users, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.table(data);
            // console.log(users);
            for (let coin in users) {
                // console.log(coin, 'coin');
                for (let user in users[coin]) {
                    // console.log(user,'index');
                    console.log(users[coin][user]);
                    let userData = users[coin][user].assets.coins.find(coins => coins.symbol === coin);
                    if (!userData)
                        return;
                    console.log('userData', userData);
                    console.log("for symbol", coin, " he bought at", (_a = users[coin][user].assets.coins.find(coins => coins.symbol === coin)) === null || _a === void 0 ? void 0 : _a.bought_at);
                    console.log("Current Price of" + coin + " is ", data[coin]);
                    // LOGICS
                    if (userData.bought_at > data[coin]) {
                        console.log("User", user, "is losing money on", coin);
                    }
                    if (userData.bought_at < data[coin]) {
                        console.log("User", user, " gains money on", coin);
                    }
                    // Gets the risk data 
                    const riskMargins = this.riskManagement(userData === null || userData === void 0 ? void 0 : userData.bought_at, userData === null || userData === void 0 ? void 0 : userData.sold_at);
                    // Order handler
                    console.log("if reach the new buy position, buy/ use limit order to buy for us  ");
                    //sell time
                    if (riskMargins.profitMargin !== 0 && data[coin] >= riskMargins.profitMargin) {
                        // if we want to sell all having volume we can call the volumeCalculator to get the current volume for selling and then send that with limit  
                        //if reach to profitMargin sell/ use limit order to sell for us"
                        const volume = this.volumeCalculator(data[coin], userData === null || userData === void 0 ? void 0 : userData.volume, userData === null || userData === void 0 ? void 0 : userData.bought_at);
                    }
                    //Buy time
                    if (riskMargins.newBuyPosition !== 0 && data[coin] <= riskMargins.newBuyPosition) {
                        const volume = this.volumeCalculator(data[coin], userData === null || userData === void 0 ? void 0 : userData.volume, userData === null || userData === void 0 ? void 0 : userData.bought_at);
                    }
                    // console.log(this.riskManagement(userData?.bought_at, userData?.sold_at));
                    //volume 
                    // userData &&
                    //   this.volumeCalculator(data[coin], userData?.volume, userData?.bought_at);
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
    volumeCalculator(currentPrice, volume, boughtPrice) {
        const currentVolume = (currentPrice * volume) / boughtPrice;
        console.log("currentVolume is", currentVolume);
        return currentVolume;
    }
    orderHandling() {
    }
}
exports.default = Analyzer;
