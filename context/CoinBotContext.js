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
            // Get all accounts
            yield this.populateUsers();
            const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
            const SELECTOR = '.showPrice';
            yield this.priceManager.init(BINANCE_URL, SELECTOR);
            node_cron_1.default.schedule("*", () => this.analyze());
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
    analyze() {
        console.log('called analyze');
        // 1. Get data from puppeteer
        const SELECTOR = '.showPrice';
        this.priceManager.getData(SELECTOR);
        // const data = ...();
        const data = {};
        // 2. Analyze data
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
            const coinsAccounts = {};
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
        });
    }
}
exports.default = CoinBotContext;
