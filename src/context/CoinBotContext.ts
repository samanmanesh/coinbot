import Analyzer from "../routes/analyzer";
import { IAccount } from "../models/Account";
import AccountManager from "../managers/AccountManager"
import cron from "node-cron";
import PriceManager from "../managers/PriceManager";
type CoinSymbol = string;

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

    await this.puppeteerHandler();
    // cron.schedule("* * * * * * ", () => this.analyze());

  }


  private async puppeteerHandler() {
    
    //Todo init the puppeteer

    BinanceUrlAndSelector.forEach(async (element) => {
      await this.priceManager.init(element.url, element.section, element.pageName);
    })

    

    cron.schedule(" * * * * * ", () => this.analyze('.showPrice'));

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

  private async analyze(selector: string) {
    console.log('called analyze');

    //todo 1. Get data from puppeteer
    // const data = ...();
    const data: any = {};
    // Gets data from puppeteer and store in data variable
    data.BTC = await this.priceManager.getData(selector, 'BTC');
    data.ADA = await this.priceManager.getData(selector, 'ADA');

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
    await this.analyzer.analyze(this.coinsAccounts, data); // send as params

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