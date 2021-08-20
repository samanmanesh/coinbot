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
const MarketData_1 = __importDefault(require("../models/MarketData"));
const axios_1 = __importDefault(require("axios"));
class MarketDataManager {
    getMarketDataFromAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            let marketData;
            // I could not use quotes for asking specific coins data due to the Api limit
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
                marketData = {
                    date_added: new Date(),
                    coins,
                };
            }
            catch (error) {
                console.error(error.message);
            }
            return marketData;
        });
    }
    getMarketData() {
        return __awaiter(this, void 0, void 0, function* () {
            const marketData = yield MarketData_1.default.findOne({});
            return marketData;
        });
    }
    updateMarketData(marketData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield MarketData_1.default.update({}, marketData);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = MarketDataManager;
