import Analyzer from "../routes/analyzer";
import { IAccount } from "../models/Account";
import AccountManager from "../managers/AccountManager"
import cron from "node-cron";
import PriceManager from "../managers/PriceManager";
type CoinSymbol = string;

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

]

export default class CoinBotContext {
  public static instance: CoinBotContext;

  private analyzer: Analyzer = new Analyzer();
  private accountManager: AccountManager = new AccountManager();
  private coinsAccounts: Record<CoinSymbol, IAccount[]> = {};
  private priceManager = new PriceManager();
  constructor() {
    if (CoinBotContext.instance) {
      return CoinBotContext.instance;
    }
    CoinBotContext.instance = this;
  }

  public async runCron() {
    // Get all accounts
    await this.populateUsers();

    // // init the puppeteer
    // //test 
    // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
    // const SELECTOR = '.showPrice';
    // await this.priceManager.init(BINANCE_URL, SELECTOR);

    await this.puppeteerHandler();
    cron.schedule("* * * * * * ", () => this.analyze());

    // # ┌────────────── second (optional)
    // # │ ┌──────────── minute
    // # │ │ ┌────────── hour
    // # │ │ │ ┌──────── day of month
    // # │ │ │ │ ┌────── month
    // # │ │ │ │ │ ┌──── day of week
    // # │ │ │ │ │ │
    // # │ │ │ │ │ │
    // # * * * * * *

  }


  private async puppeteerHandler() {
    // init the puppeteer
    // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
    // const SELECTOR = '.showPrice';
    // await this.priceManager.init(BINANCE_URL, SELECTOR);

    BinanceUrlAndSelector.forEach(async (urlAndSelector) => {
      await this.priceManager.init(urlAndSelector.url, urlAndSelector.section);
    }

    )
  }

  public updateUser(account: IAccount, removedCoinSymbol?: CoinSymbol) {
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
    }
    )
  }

  private analyze() {
    console.log('called analyze');
    // 1. Get data from puppeteer
    // const data = ...();
    let data: any = {};

    //test 
    // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
    // const SELECTOR = '.showPrice';

    // data = this.priceManager.getData(BINANCE_URL, SELECTOR);

    BinanceUrlAndSelector.forEach(async (urlAndSelector) => { 
      data = this.priceManager.getData(urlAndSelector.url, urlAndSelector.section);
    }
    )
    

    // 2. Analyze data
    this.analyzer.analyze(this.coinsAccounts, data); // send as params
  }

  private async populateUsers() {
    // todo
    console.debug('Populating users');
    const accounts = await this.accountManager.getAccounts();
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
  }

}


//Note: I had to run runCron() through a get request because it was not working with this.runCron() in index.ts(app) as it runs in constructor before we connect to the database therefore it couldn't ask for accounts to get from database since we were not connected to the database yet.