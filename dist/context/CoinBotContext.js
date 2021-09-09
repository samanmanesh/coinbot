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
    {
        pageName: "XRP",
        expectedData: 'XRP/USDT',
        url: 'https://www.binance.com/en/trade/XRP_USDT?layout=pro',
        section: '.showPrice'
    },
];
// const getUrlSelector = (coinSymbol: string)
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
            yield this.populateUsers();
            // await this.puppeteerHandler();
            yield this.depositDistributionHandler();
        });
    }
    puppeteerHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            //Todo init the puppeteer
            BinanceUrlAndSelector.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                yield this.priceManager.init(element.url, element.section, element.pageName);
            }));
            node_cron_1.default.schedule(" * * * * * ", () => this.analyze('.showPrice'));
        });
    }
    updateUser(account, removedCoinSymbol) {
        if (removedCoinSymbol) {
            this.coinsAccounts[removedCoinSymbol] = this.coinsAccounts[removedCoinSymbol].filter(coinAccount => coinAccount.username !== account.username);
            return;
        }
        account.assets.coins.forEach(coins => {
            const currentCoinAccounts = this.coinsAccounts[coins.symbol];
            if (!currentCoinAccounts)
                return;
            const userIndex = currentCoinAccounts.findIndex(user => user.username === account.username);
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
            // const coinSymbols = ['BTC', 'ADA'];
            // Gets data from puppeteer and store in data variable
            for (let coinSymbol in this.coinsAccounts) {
                data[coinSymbol] = yield this.priceManager.getData(selector, coinSymbol);
            }
            // data.BTC = await this.priceManager.getData(selector, 'BTC');
            // data.ADA = await this.priceManager.getData(selector, 'ADA');
            //todo 2. Analyze data
            yield this.analyzer.analyze(this.coinsAccounts, data); // send as params
        });
    }
    populateUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('Populating users');
            const accounts = yield this.accountManager.getAccounts();
            if (!accounts) {
                console.error('No accounts found');
                return;
            }
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
            // console.log(" coinsAccounts", this.coinsAccounts);
        });
    }
    depositDistributionHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            //todo firs go through each account.asset.wallet and get the total for each account  deposit
            let newCoinPerAllocatedPrice = [];
            const accounts = yield this.accountManager.getAccounts();
            if (!accounts)
                return;
            for (let account in accounts) {
                const accountDeposit = accounts[account].assets.wallet.deposit;
                console.log("accounts deposit is", accountDeposit);
                for (let coin in accounts[account].assets.coins) {
                    const accountCoin = accounts[account].assets.coins[coin];
                    console.log("coin is", accountCoin);
                    newCoinPerAllocatedPrice.push({
                        accountName: accounts[account].username,
                        symbol: accounts[account].assets.coins[coin].symbol,
                        accountDeposit: accountDeposit,
                        allocated_price: accountCoin.allocated_price,
                    });
                }
            }
            console.log("newCoinPerAllocatedPrice", newCoinPerAllocatedPrice);
            //todo seconds for each account, gets all the account.assets.coins.bought_at and sold_at for calculating the total deposit for that account
            //todo gets the number of coins and divide the total deposit on the number of coins
            //todo third change the account.assets.coin.allocated_price to new allocated_price for each.
            //!NOTE I added update wallet method and update allocated_price in account manager to be used for this part 
        });
    }
}
exports.default = CoinBotContext;
//Note: I had to run runCron() through a get request because it was not working with this.runCron() in index.ts(app) as it runs in constructor before we connect to the database therefore it couldn't ask for accounts to get from database since we were not connected to the database yet.
