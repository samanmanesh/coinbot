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
                    console.log("for symobl", coin, " he bought at", (_a = users[coin][user].assets.coins.find(coins => coins.symbol === coin)) === null || _a === void 0 ? void 0 : _a.buy_at);
                    console.log(userData, 'userData');
                    console.log("Current Price of" + coin + " is", data[coin]);
                }
            }
        });
    }
    //Todo 1> We want to compare the price here 
    //Todo 2> analyze gets the price each time cron works/  meanwhile we want to pass it to a function or method to :
    //todo:  first go though each coin for each accounts and then compare the price. 
    //todo: So if the price is more than 30% on n% of bought price, sell that coin. 
    //todo: if the price is sold in high we have to look for lower price to but it for that account.  
    // async getPreferredCoinsData(req: Request, res: Response) {
    //   let account = undefined;
    //   let currencyData = undefined;
    //   let preferredCoinsData = undefined;
    //   try {
    //     account = await this.getAccountsData(req, res);
    //   } catch (error) {
    //     console.error("error is", error);
    //   }
    //   try { 
    //     currencyData = await this.getCurrencyData();
    //   } catch (error) { 
    //     console.error("error is", error);
    //   }
    //   if (!account || !currencyData) {
    //     return;
    //   }
    //   // try {
    //   //   preferredCoinsData = await this.analyzerManager.preferredCoinsHandler(account, currencyData);
    //   //   console.log("preferredCoinsData is", preferredCoinsData);
    //   // } catch (error) {
    //   //   console.log("error is", error);
    //   // }
    //   return preferredCoinsData;
    // }
    // Getting the data related to accounts from data base
    getAccountsData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = undefined;
            const { username } = req.params;
            try {
                account = yield this.accountManager.getAccount(username);
                res &&
                    res.status(200).json(account);
                if (!account)
                    res.status(400).json({ message: "Account not found" });
                console.log("accountList is", account);
            }
            catch (error) {
                res &&
                    res.status(400).json({ message: error.message });
            }
            return account;
        });
    }
    // Getting the Currency data From DB
    getCurrencyData() {
        return __awaiter(this, void 0, void 0, function* () {
            let currencyData = undefined;
            try {
                currencyData = yield this.marketDataManager.getMarketData();
                console.log("Currency saved data ", currencyData);
                if (!currencyData) {
                    return;
                }
            }
            catch (error) {
                console.log("error is", error);
            }
            return currencyData;
        });
    }
}
exports.default = Analyzer;
