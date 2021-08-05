import Account, { IAccount } from "../models/Account";

export default class AccountManager {
  constructor() {
  }

  public async getAccount(username: string) {
    return Account.findOne({ username });
  }

  public async getAccounts(): Promise<IAccount[] | undefined> {
    let allAccounts = undefined;
    try {
      allAccounts = await Account.find();
    } catch (error) {
      console.error(error);
    }
    return allAccounts;
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
};