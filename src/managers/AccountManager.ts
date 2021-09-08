import { DeleteResult } from 'mongodb';
import CoinBotContext from '../context/CoinBotContext';
import Account, { IAccount } from "../models/Account";
import { IWalletCoin, IAccountAssets, IAccountWallet } from "../types";
export default class AccountManager {


  public async getAccount(username: string): Promise<IAccount | undefined> {
    let requiredAccount = undefined;
    try {
      requiredAccount = Account.findOne({ username });
      if (requiredAccount === undefined) {
        return undefined;
      }
    } catch (error) {
      console.error(error.message);
    }

    return requiredAccount;
  }

  public async getAccounts(): Promise<IAccount[] | undefined> {
    let allAccounts = undefined;
    try {
      allAccounts = await Account.find();
      if (allAccounts === undefined) {
        return undefined;
      }
      // return allAccounts;
    } catch (error) {
      console.error(error);
    }
    return allAccounts;
  }

  public async authorizeAccount(username: string, password?: string): Promise<boolean | undefined> {

    const fromDB = await this.getAccount(username);

    if (fromDB === undefined) {
      return undefined;
    }
    if (fromDB) return true;


    // if (password === undefined) {
    //   return fromDB.password === undefined;
    // }
    // return fromDB.password === password;
  }


  public async createAccount(account: IAccount): Promise<IAccount | undefined> {
    try {
      account = await Account.save(account);
    } catch (error) {
      console.error(error);
    }
    return account;
  }

  public async updateAccount(username: string, account: IAccount): Promise<IAccount | undefined> {
    try {
      await Account.updateOne({ username }, account);

    } catch (error) {
      console.error(error);
    }
    return account;
  }

  //Todo a general update to gets required section and value to update
  // public async updateAccount(username: string, section: string, value: IAccount): Promise<IAccount | undefined> {
  //   let account = await this.getAccount(username);
  //   // [...account, account?.assets: value];
  //   if (!account) return;
  //   switch (section) {
  //     case "coins":


  //      break;

  //    default:
  //      break;
  //  }


  //   try {
  //     await Account.updateOne({ username }, account);

  //   } catch (error) {
  //     console.error(error);
  //   }
  //   return account;
  // }


  public async deleteAccount(username: string): Promise<DeleteResult | undefined> {
    try {
      return await Account.remove({ username });
    } catch (error) {
      console.error(error);
    }

  }

  public async addPreferredCoinsHandler(username: string, preferredCoins: string[]) {
    console.log(username, "username");
    let account = await this.getAccount(username);
    if (!account) return;

    // make new array of all old coins and new preferred coins, without duplicates
    account.preferred_coins = Array.from(new Set([...account.preferred_coins, ...preferredCoins]));

    try {
      await Account.updateOne({ username }, account);
    } catch (error) {
      console.error(error);
    }
    return account;
  }


  public async removePreferredCoinsHandler(username: string, removeCoins: string[]) {

    let account = await this.getAccount(username);
    if (!account) return;

    for (let coin in removeCoins) {
      let indexCoin = removeCoins[coin];
      account.preferred_coins = account.preferred_coins.filter(c => c !== indexCoin);
    }

    try {
      await Account.updateOne({ username }, account);
    } catch (error) {
      console.error(error);
    }
    return account;

  }

  public async coinExistenceCheck(username: string, coin: string) {
    let account = await this.getAccount(username);
    if (!account) return;


    if (account.assets.coins.some(c => c.symbol === coin)) {
      // console.log("coin already exists");
      return true;
    }

    return false;

  }

  public async addCoinToAccountsAssets(username: string, coin: IWalletCoin) {
    let account = await this.getAccount(username);
    if (!account) return;

    account.assets.coins = Array.from(new Set([...account.assets.coins, coin]));

    try {
      await Account.updateOne({ username }, account);
    } catch (error) {
      console.error(error);
    }
    CoinBotContext.instance.updateUser(account);
    return account;
  }

  public async removeCoinFromAccountsAssets(username: string, coin: string) {
    let account = await this.getAccount(username);
    if (!account) return;

    account.assets.coins = account.assets.coins.filter(c => c.symbol !== coin);

    try {
      await Account.updateOne({ username }, account);
    } catch (error) {
      console.error(error);
    }
    CoinBotContext.instance.updateUser(account, coin);
    return account;
  }

  public async updateCoinInAccountsAssets(username: string, coin: IWalletCoin) {
    let account = await this.getAccount(username);
    if (!account) return;
    const updatedCoinIndex = account.assets.coins.findIndex(c => c.symbol === coin.symbol);
    if (updatedCoinIndex === -1) {
      account.assets.coins.push(coin);
    } else {
      account.assets.coins[updatedCoinIndex] = coin;
    }

    try {
      await Account.updateOne({ username }, account);
    } catch (error) {
      console.error(error);
    }

    CoinBotContext.instance.updateUser(account);

    return account;
  }

  public async updateAllocatedPriceInAccountAssets(username: string, newPrice: number, symbol: string) {
    let account = await this.getAccount(username);
    if (!account) return;

    const updatedCoinIndex = account.assets.coins.findIndex(c => c.symbol === symbol);

    if (updatedCoinIndex === -1) return
     
    account.assets.coins[updatedCoinIndex].allocated_price = newPrice;

    try {
      await Account.updateOne({ username }, account);
    } catch (error) {
      
        console.error(error);

    }
    return account;
  }


  public async updateWallet(username: string, newWallet: IAccountWallet) {

    let account = await this.getAccount(username);
    if (!account) return;

    account.assets.wallet = newWallet;

    try {
      Account.updateOne({ username }, account);

    } catch (error) {

      console.error(error);
    }
    return account;
  }
}

