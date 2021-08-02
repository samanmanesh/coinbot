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
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const MarketData_1 = __importDefault(require("../models/MarketData"));
const coinSymbols = ["BTC", "ETH", "DOGE", "ADA"];
var MarketDataPath;
(function (MarketDataPath) {
    MarketDataPath["Base"] = "/";
})(MarketDataPath || (MarketDataPath = {}));
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
                const newMarketData = new MarketData_1.default({
                    date_added: new Date(),
                    coins,
                });
                try {
                    yield newMarketData.save();
                    console.log("added market data!");
                }
                catch (error) {
                    console.error(error);
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
    addMarketData(coins) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMarketData = new MarketData_1.default({
                date_added: new Date(),
                coins,
            });
            try {
                yield newMarketData.save();
                console.log("added market data!");
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = MarketDataController;
