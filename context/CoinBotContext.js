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
        pageName: "BTC",
        expectedData: 'BTC/USDT',
        url: 'https://www.binance.com/en/trade/BTC_USDT?layout=basic',
        section: '.showPrice'
    },
    {
        pageName: "ADA",
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
            yield this.puppeteerHandler();
            // cron.schedule("* * * * * * ", () => this.analyze());
        });
    }
    puppeteerHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            //Todo init the puppeteer
            BinanceUrlAndSelector.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                yield this.priceManager.init(element.url, element.section, element.pageName);
            }));
            node_cron_1.default.schedule(" * * * * * ", () => this.analyze('.showPrice'));
            //#region test
            // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
            // const SELECTOR = '.showPrice';
            // await this.priceManager.init(BINANCE_URL, SELECTOR);
            // BinanceUrlAndSelector.forEach(async (urlAndSelector) => {
            //   await this.priceManager.init(urlAndSelector.url, urlAndSelector.section);
            // }
            // )
            //// int the Ada
            // await this.priceManager.ADAInit('https://www.binance.com/en/trade/ADA_USDT?layout=basic', '.showPrice').then(() => {
            //   cron.schedule("*/2 * * * * * ", () => this.analyze('.showPrice'));
            // })
            //// int the BTC
            // await this.priceManager.BTCInit('https://www.binance.com/en/trade/BTC_USDT?layout=basic', '.showPrice').then(() => {
            //   cron.schedule("*/2 * * * * * ", () => this.analyze('.showPrice'));
            // }
            // )
            //// init first and then just call a cron
            // await this.priceManager.BTCInit('https://www.binance.com/en/trade/BTC_USDT?layout=basic', '.showPrice')
            // await this.priceManager.ADAInit('https://www.binance.com/en/trade/ADA_USDT?layout=basic', '.showPrice')
            // cron.schedule("*/2 * * * * * ", () => this.analyze('.showPrice'));
            // init all having coins
            //#endregion
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
        return __awaiter(this, void 0, void 0, function* () {
            console.log('called analyze');
            //todo 1. Get data from puppeteer
            // const data = ...();
            const data = {};
            // Gets data from puppeteer and store in data variable
            data.BTC = yield this.priceManager.getData(selector, 'BTC');
            data.ADA = yield this.priceManager.getData(selector, 'ADA');
            //#region test for making it optimize but not working
            //todo 1: make a function to go over our coinsAccounts and gets all existing coins and send them for getData to gets the price and store that into related symbol in data and then send that to analyzer
            //  for (let coin in Object.keys(this.coinsAccounts)) {
            //   let coinSymbol = Object.keys(this.coinsAccounts)[coin];
            //   data.coinSymbol = await this.priceManager.getData(selector, coinSymbol);
            // }
            // Object.keys(this.coinsAccounts).forEach(async coin => {
            //   data.coin = await this.priceManager.getData(selector, coin);
            //   console.log("coin", coin);
            // })
            //#endregion
            //todo 2. Analyze data
            yield this.analyzer.analyze(this.coinsAccounts, data); // send as params
        });
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
