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
const node_cron_1 = __importDefault(require("node-cron"));
const MarketDataManager_1 = __importDefault(require("../managers/MarketDataManager"));
var MarketDataPath;
(function (MarketDataPath) {
    MarketDataPath["Base"] = "/";
})(MarketDataPath || (MarketDataPath = {}));
class MarketDataController {
    constructor() {
        this.router = express_1.default.Router();
        this.marketDataManager = new MarketDataManager_1.default();
        this.setupRoutes();
        // this.setupCronJobs();
    }
    setupCronJobs() {
        node_cron_1.default.schedule("* * * * *", () => this.refreshMarketData());
    }
    setupRoutes() {
        this.router.get(MarketDataPath.Base, (req, res) => this.refreshMarketData(req, res));
    }
    refreshMarketData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let marketDataFromApi = undefined;
            // let updatedMarketData = undefined;
            try {
                marketDataFromApi = yield this.marketDataManager.getMarketDataFromAPI();
            }
            catch (error) {
                console.error('Failed to get market data from API', error);
            }
            if (!marketDataFromApi) {
                return;
            }
            try {
                yield this.marketDataManager.updateMarketData(marketDataFromApi);
            }
            catch (error) {
                console.error('Failed to put market data into DB', error);
            }
            res && res.sendStatus(200);
        });
    }
}
exports.default = MarketDataController;
