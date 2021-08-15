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
const express_1 = __importDefault(require("express"));
// import { getsAllCurrencyData } from "./marketData.controller";
const AccountManager_1 = __importDefault(require("../managers/AccountManager"));
const MarketDataManager_1 = __importDefault(require("../managers/MarketDataManager"));
var AnalyzerPath;
(function (AnalyzerPath) {
    AnalyzerPath["Base"] = "/";
    AnalyzerPath["ByUsername"] = "/:username";
})(AnalyzerPath || (AnalyzerPath = {}));
class Analyzer {
    // accountControllerInstance = new AccountController();
    constructor() {
        this.router = express_1.default.Router();
        this.accountManager = new AccountManager_1.default();
        this.marketDataManager = new MarketDataManager_1.default();
        this.setupRoutes();
    }
    setupRoutes() {
        // this.router.get(SellAnalyzerPath.ByUsername, this.getAccountsDataHandler.bind(this));
        // this.router.get(SellAnalyzerPath.ByUsername, this.getCurrencyDataHandler.bind(this));
        this.router.get(AnalyzerPath.Base, this.getMarketDataTestApi.bind(this));
    }
    analyze(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Todo first gets the data related to accounts from data base
            // this.gettingAccountsDataHandler(req , res);
            // try {
            //   const accountList = await getAccountByUsername(req, res);
            //   res &&
            //     res.status(200).json(accountList);
            //   console.log("acccountList is", accountList);
            // } catch (error) {
            //   res &&
            //     res.status(400).json({ message: error.message });
            // }
            // try {
            //   const accountList = await getAllAccounts();
            //   res.status(200).json(accountList);
            //   console.log("acccountList is", accountList);
            // } catch (error) {
            //   res.status(400).json({ message: error.message });
            // }
            //Todo then gets the data for preferred_coins for each account from the data base
            // Getting the Data From DB
            // this.gettingCurrencyDataHandler(res);
            // try {
            //   const coinsSavedData = await getsAllCurrencyData();
            //   console.log("Coins saved data ", coinsSavedData)
            //   res.status(200).json(coinsSavedData);
            // } catch (error) {
            //   res.status(400).json({ message: error.message });
            // }
        });
    }
    getAccountsDataHandler(req, res) {
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
            // const currencyData = this.getCurrencyDataHandler();
        });
    }
    getCurrencyDataHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            let currencyData = undefined;
            // Getting the Currency data From DB
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
    getMarketDataTestApi(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let marketData = undefined;
            try {
                marketData = yield this.marketDataManager.getMarketDataFromAPI();
                // console.log("Market data is", marketData);
                if (!marketData) {
                    return;
                }
                res.status(200).send(marketData);
            }
            catch (error) {
                // console.error("error is", error);
                res.status(500).send(error);
            }
        });
    }
}
exports.default = Analyzer;