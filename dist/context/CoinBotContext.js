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
const analyzer_1 = __importDefault(require("../routes/analyzer"));
const AccountManager_1 = __importDefault(require("../managers/AccountManager"));
const node_cron_1 = __importDefault(require("node-cron"));
const PriceManager_1 = __importDefault(require("../managers/PriceManager"));
const BinanceUrlAndSelector = [
    {
        expectedData: 'BTC/USDT',
        url: 'https://www.binance.com/en/trade/BTC_USDT?layout=basic',
        section: '.showPrice'
    },
    {
        expectedData: 'ADA/USDT',
        url: 'https://www.binance.com/en/trade/ADA_USDT?layout=basic',
        section: '.showPrice'
    },
];
class CoinBotContext {
    constructor() {
        this.analyzer = new analyzer_1.default();
        this.accountManager = new AccountManager_1.default();
        this.coinsAccounts = {};
        this.priceManager = new PriceManager_1.default();
        if (CoinBotContext.instance) {
            return CoinBotContext.instance;
        }
        CoinBotContext.instance = this;
    }
    runCron() {
        return __awaiter(this, void 0, void 0, function* () {
            //todo Get all accounts
            yield this.populateUsers();
            // // init the puppeteer
            // //test 
            // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
            // const SELECTOR = '.showPrice';
            // await this.priceManager.init(BINANCE_URL, SELECTOR);
            yield this.puppeteerHandler();
            // cron.schedule("* * * * * * ", () => this.analyze());
            // # ┌────────────── second (optional)
            // # │ ┌──────────── minute
            // # │ │ ┌────────── hour
            // # │ │ │ ┌──────── day of month
            // # │ │ │ │ ┌────── month
            // # │ │ │ │ │ ┌──── day of week
            // # │ │ │ │ │ │
            // # │ │ │ │ │ │
            // # * * * * * *
        });
    }
    puppeteerHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            //Todo init the puppeteer
            // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
            // const SELECTOR = '.showPrice';
            // await this.priceManager.init(BINANCE_URL, SELECTOR);
            // BinanceUrlAndSelector.forEach(async (urlAndSelector) => {
            //   await this.priceManager.init(urlAndSelector.url, urlAndSelector.section);
            // }
            // )
            //// int the Ada
            yield this.priceManager.ADAInit('https://www.binance.com/en/trade/ADA_USDT?layout=basic', '.showPrice').then(() => {
                node_cron_1.default.schedule("* * * * * * ", () => this.analyze('.showPrice'));
            });
            //// int the BTC
            yield this.priceManager.BTCInit('https://www.binance.com/en/trade/BTC_USDT?layout=basic', '.showPrice').then(() => {
                node_cron_1.default.schedule("* * * * * * ", () => this.analyze('.showPrice'));
            });
            //// run the same time for init and get data
            // cron.schedule("* * * * *", () => this.analyze('https://www.binance.com/en/trade/BTC_USDT?layout=basic', '.showPrice'));
            //! INNIT JUST WORKS FOR THE LAST ONE THAT IS INNIT 
        });
    }
    updateUser(account, removedCoinSymbol) {
        if (removedCoinSymbol) {
            this.coinsAccounts[removedCoinSymbol] = this.coinsAccounts[removedCoinSymbol].filter(coinAccount => coinAccount.username !== account.username);
            return;
        }
        account.assets.coins.forEach(coins => {
            const userIndex = this.coinsAccounts[coins.symbol].findIndex(user => user.username === account.username);
            if (!userIndex) {
                this.coinsAccounts[coins.symbol].push(account);
                return;
            }
            this.coinsAccounts[coins.symbol][userIndex] = account;
        });
    }
    analyze(selector) {
        console.log('called analyze');
        //todo 1. Get data from puppeteer
        // const data = ...();
        let data = {};
        //test 
        // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
        // const SELECTOR = '.showPrice';
        // data = this.priceManager.getData(BINANCE_URL, SELECTOR);
        // BinanceUrlAndSelector.forEach(async (urlAndSelector) => { 
        //   data = this.priceManager.getData(urlAndSelector.url, urlAndSelector.section);
        // }
        // )
        data.BTCP = this.priceManager.BTCGetData(selector);
        data.ADAP = this.priceManager.ADAGetData(selector);
        // data = this.priceManager.BTCInitAndGetData(url, selector);
        //todo 2. Analyze data
        this.analyzer.analyze(this.coinsAccounts, data); // send as params
    }
    populateUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // todo
            console.debug('Populating users');
            const accounts = yield this.accountManager.getAccounts();
            if (!accounts) {
                console.error('No accounts found');
                return;
            }
            // const coinsAccounts = {};
            accounts.forEach(account => {
                // for each coin in account
                account.assets.coins.forEach(coin => {
                    // if there is no value at this coin, create it
                    if (!this.coinsAccounts[coin.symbol]) {
                        this.coinsAccounts[coin.symbol] = [];
                    }
                    // add account to coin
                    this.coinsAccounts[coin.symbol].push(account);
                });
            });
            console.log(" coinsAccounts", this.coinsAccounts);
        });
    }
}
exports.default = CoinBotContext;
//Note: I had to run runCron() through a get request because it was not working with this.runCron() in index.ts(app) as it runs in constructor before we connect to the database therefore it couldn't ask for accounts to get from database since we were not connected to the database yet.
