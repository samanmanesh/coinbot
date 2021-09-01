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
class PriceController {
    // priceManager = new PriceManager(this.BINANCE_URL,this.SELECTOR);
    constructor() {
        this.router = express_1.default.Router();
        this.BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
        this.SELECTOR = '.showPrice';
        this.getPrices = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const prices = await this.priceManager.interval();
                // res.send(prices);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get("/", this.getPrices.bind(this));
        // this.router.post("/", this.createPrice);
        // this.router.put("/:id", this.updatePrice);
        // this.router.delete("/:id", this.deletePrice);
    }
}
exports.default = PriceController;
