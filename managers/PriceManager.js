"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const puppeteer_1 = __importDefault(require("puppeteer"));
class PriceManager {
    constructor() {
        // constructor() {}
        // async getMarketPrice () {
        //   const browser = await puppeteer.launch();
        //   const page = await browser.newPage();
        //   await page.goto('https://www.google.com/');
        //   await page.screenshot({ path: 'example.png' });
        //   await browser.close();
        // }
        this.browser = null;
        this.page = null;
        this.intervalRate = 500;
        this.url = '';
        this.selector = '';
    }
    // constructor(url: string, selector: string) {
    //   this.url = url;
    //   this.selector = selector;
    // }
    interval() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.init().then(() => setInterval(() => this.getData(), this.intervalRate));
        });
    }
    init(url, selector) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            this.browser = yield puppeteer_1.default.launch();
            //@ts-ignore
            this.page = yield this.browser.newPage();
            //@ts-ignore
            yield this.page.goto(url);
            //@ts-ignore
            yield this.page.waitForSelector(selector);
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            let data = yield this.page.$eval(this.selector, node => {
                return node.innerText;
            });
            console.log(data);
            console.log('------');
            return data;
        });
    }
    getDataTest(url, selector) {
        return __awaiter(this, void 0, void 0, function* () {
            // //@ts-ignore
            // this.browser = await puppeteer.launch();
            // //@ts-ignore
            // this.page = await this.browser.newPage();
            // //@ts-ignore
            // await this.page.goto(url);
            // //@ts-ignore
            // await this.page.waitForSelector(selector);
            //@ts-ignore
            let data = yield this.page.$eval(selector, node => {
                return node.innerText;
            });
            console.log(data);
            console.log('------');
            return data;
        });
    }
}
exports.default = PriceManager;
// const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=pro';
// const SELECTOR = '.chart-title-indicator-container';
// const scraper = new Scraper(BINANCE_URL, SELECTOR);
