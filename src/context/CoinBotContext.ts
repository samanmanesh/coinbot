import Analyzer from "../routes/analyzer";
import { IAccount } from "../models/Account";
import AccountManager from "../managers/AccountManager"
import cron from "node-cron";
import PriceManager from "../managers/PriceManager";
type CoinSymbol = string;

const BinanceUrlAndSelector = [
  {
    page: "BTC",
    expectedData: 'BTC/USDT',
    url: 'https://www.binance.com/en/trade/BTC_USDT?layout=basic',
    section: '.showPrice'
  },
  {
    page: "ADA",
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
    //todo Get all accounts
    await this.populateUsers();

    // // init the puppeteer
    // //test 
    // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
    // const SELECTOR = '.showPrice';
    // await this.priceManager.init(BINANCE_URL, SELECTOR);

    await this.puppeteerHandler();
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

  }


  private async puppeteerHandler() {
    //Todo init the puppeteer

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
    
    BinanceUrlAndSelector.forEach(async (element) => {
      await this.priceManager.init(element.url, element.section, element.page);
    })

    cron.schedule("*/2 * * * * * ", () => this.analyze('.showPrice'));



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

  private analyze(selector: string) {
    console.log('called analyze');
    //todo 1. Get data from puppeteer
    // const data = ...();
    const data: any = {};

    //test 
    // const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=basic';
    // const SELECTOR = '.showPrice';

    // data = this.priceManager.getData(BINANCE_URL, SELECTOR);

    // BinanceUrlAndSelector.forEach(async (urlAndSelector) => { 
    //   data = this.priceManager.getData(urlAndSelector.url, urlAndSelector.section);
    // }
    // )



    // data.BTC = this.priceManager.BTCGetData(selector);
    // data.ADA = this.priceManager.ADAGetData(selector);
    // console.log(data.BTC, "check btc");
    // console.log(data.ADA, "check Ada");
    data.BTC = this.priceManager.getData(selector, 'BTC');
    data.ADA = this.priceManager.getData(selector, 'ADA');
    console.log(data.BTC, "check btc");
    console.log(data.ADA, "check Ada");

    // data = this.priceManager.BTCInitAndGetData(url, selector);

    //todo 2. Analyze data
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