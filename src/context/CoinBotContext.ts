import Analyzer from "../routes/analyzer.controller";
import { IAccount} from "../models/Account";

type CoinSymbol = string;
export default class CoinBotContext {
  public static instance: CoinBotContext;
  private analyzer: Analyzer = new Analyzer();
  private accounts: Record<CoinSymbol, IAccount[]> = {};

  constructor() {
    if (CoinBotContext.instance) {
      return CoinBotContext.instance;
    }
    CoinBotContext.instance = this;
    // run cron for this.analyze()
  }

  analyze() {

    // get data needed
    this.analyzer.analyze(this.accounts); // send as params
  }

  populateUsers() {
    // todo
    console.debug('Populating users');
    // 1, get users from db
    // 2. convert the users { coinID: user[] }
  }

  updateUser(account: IAccount) {
    account.assets.coins.forEach(coins => {
      const userIndex = this.accounts[coins.symbol].findIndex(user => user.username === account.username);
      if (!userIndex) {
        
      }
      // this.accounts[coins.symbol].push(account);
    }
    // todo
    // 2.  for each coin in assets, add to this.users
  }


  async getAccountsData() {
    let accounts = undefined;
    try {
      accounts = await this.accountManager.getAccounts(); // todo
      this.accounts = accounts;
      console.log("accountList is", accounts);
    } catch (error) {
      console.error("error is", error);
    }
    // return account;
  }

  // Getting the Currency data From DB
  async getCurrencyData() {

    // let currencyData = undefined;
    // try {
    //   currencyData = await this.marketDataManager.getMarketData();
    //   console.log("Currency saved data ", currencyData);
    //   if (!currencyData) {
    //     return;
    //   }

    // } catch (error) {
    //   console.log("error is", error);
    // }

    // return currencyData;
    return undefined;
  }
}