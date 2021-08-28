import { DeleteResult } from 'mongodb';
import Account, { IAccount } from "../models/Account";
import { IWalletCoin, IAccountAssets } from "../types";
export default class AccountManager {
  constructor() {
  }

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

  public async addCoinsToAccountsAssets(username: string, coins: IWalletCoin[]) {
    let account = await this.getAccount(username);
    if (!account) return;
    
    account.assets.coins = Array.from(new Set([...account.assets.coins, ...coins]));

    console.log(account.assets.coins,"check coins after update"); 

    try {
      await Account.updateOne({ username }, account);
    } catch (error) {
      console.error(error);
    }
    return account;
  }

}

