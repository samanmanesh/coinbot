import { ICoinPerAllocatedPrice } from './../types/index';
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
  {
    pageName: "XRP",
    expectedData: 'XRP/USDT',
    url: 'https://www.binance.com/en/trade/XRP_USDT?layout=pro',
    section: '.showPrice'
  },
  
]

// const getUrlSelector = (coinSymbol: string)

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

    await this.populateUsers();

    // await this.puppeteerHandler();

    await this.depositDistributionHandler();
  }


  private async puppeteerHandler() {
    
    //Todo init the puppeteer

    BinanceUrlAndSelector.forEach(async (element) => {
      await this.priceManager.init(element.url, element.section, element.pageName);
    })

    

    cron.schedule(" * * * * * ", () => this.analyze('.showPrice'));


  }



  public updateUser(account: IAccount, removedCoinSymbol?: CoinSymbol) {
    if (removedCoinSymbol) {
      this.coinsAccounts[removedCoinSymbol] = this.coinsAccounts[removedCoinSymbol].filter(coinAccount => coinAccount.username !== account.username);
      return;
    }

    account.assets.coins.forEach(coins => {
      const currentCoinAccounts = this.coinsAccounts[coins.symbol];
      if (!currentCoinAccounts) return;
      const userIndex = currentCoinAccounts.findIndex(user => user.username === account.username);
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
    // const coinSymbols = ['BTC', 'ADA'];
    // Gets data from puppeteer and store in data variable

    for (let coinSymbol in this.coinsAccounts) {
     data[coinSymbol] = await this.priceManager.getData(selector, coinSymbol);
   }
    // data.BTC = await this.priceManager.getData(selector, 'BTC');
    // data.ADA = await this.priceManager.getData(selector, 'ADA');

    //todo 2. Analyze data
    await this.analyzer.analyze(this.coinsAccounts, data); // send as params

  }

  private async populateUsers() {
    console.debug('Populating users');
    const accounts = await this.accountManager.getAccounts();
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
  }

  
  private async depositDistributionHandler() {

    //todo firs go through each account.asset.wallet and get the total for each account  deposit
    const newCoinPerAllocatedPrice : ICoinPerAllocatedPrice[] = {};

    const accounts = await this.accountManager.getAccounts();
    if (!accounts) return;

    for (let account in accounts){
      
      const accountDeposit = accounts[account].assets.wallet.deposit; 
      console.log("accounts deposit is",accountDeposit);

      for ( let coin in accounts[account].assets.coins){
        
        const accountCoin = accounts[account].assets.coins[coin];
        console.log("coin is", accountCoin );



            
            newCoinPerAllocatedPrice.push({
            accountName : accounts[account].username,
            symbol: accounts[account].assets.coins[coin].symbol,
            accountDeposit: accountDeposit,
            allocated_price: accountCoin.allocated_price,
          })

      }

    }
    
    console.log("newCoinPerAllocatedPrice",newCoinPerAllocatedPrice);
    //todo seconds for each account, gets all the account.assets.coins.bought_at and sold_at for calculating the total deposit for that account
    //todo gets the number of coins and divide the total deposit on the number of coins
    //todo third change the account.assets.coin.allocated_price to new allocated_price for each.
    //!NOTE I added update wallet method and update allocated_price in account manager to be used for this part 


  }

}


//Note: I had to run runCron() through a get request because it was not working with this.runCron() in index.ts(app) as it runs in constructor before we connect to the database therefore it couldn't ask for accounts to get from database since we were not connected to the database yet.