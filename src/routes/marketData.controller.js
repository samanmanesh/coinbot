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
exports.getsAllCurrencyData = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const MarketData_1 = __importDefault(require("../models/MarketData"));
// const coinSymbols = ["BTC", "ETH", "DOGE", "ADA"];
var MarketDataPath;
(function (MarketDataPath) {
    MarketDataPath["Base"] = "/";
})(MarketDataPath || (MarketDataPath = {}));
function getsAllCurrencyData(res) {
    return __awaiter(this, void 0, void 0, function* () {
        let newSavedData = undefined;
        try {
            newSavedData = yield MarketData_1.default.find();
            res && res.status(201).json(newSavedData);
        }
        catch (error) {
            res && res.status(400).json({ message: error.message });
        }
        return newSavedData;
    });
}
exports.getsAllCurrencyData = getsAllCurrencyData;
class MarketDataController {
    constructor() {
        this.router = express_1.default.Router();
        this.setupRoutes();
        // this.setupCronJobs();
    }
    setupCronJobs() {
        node_cron_1.default.schedule("* * * * *", () => this.getMarketData());
    }
    setupRoutes() {
        this.router.get(MarketDataPath.Base, this.getMarketData);
    }
    getMarketData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
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
                const { data } = yield axios_1.default.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", config);
                const coinsFromResponse = data.data;
                const coins = coinsFromResponse.map((c) => ({
                    id: c.id,
                    name: c.name,
                    symbol: c.symbol,
                    total_supply: c.total_supply,
                    last_updated: c.last_updated,
                    quote: c.quote,
                }));
                //
                const newMarketData = {
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
                    yield MarketData_1.default.update({}, newMarketData);
                    console.log("updated market data!");
                }
                catch (error) {
                    console.error(error);
                }
                // Getting the Data From DB
                try {
                    const newSavedData = yield MarketData_1.default.find();
                    res && res.status(201).json(newSavedData);
                }
                catch (error) {
                    res && res.status(400).json({ message: error.message });
                }
                //
                // await this.addMarketData(coins);
            }
            catch (err) {
                console.error(err);
            }
            res &&
                res.send({
                    message: "Got market data!!!",
                });
        });
    }
}
exports.default = MarketDataController;
