import Account, { IAccount } from "../models/Account";


// export async function  getAccounts(): Promise<IAccount[] | undefined> {
//   let allAccounts = undefined;
//   try {
//     console.log("getAccounts is read in getAccounts !");
//     allAccounts = await Account.find();
//   } catch (error) {
//     console.error(error);
//   }
//   return allAccounts;
// }

export default class AccountManager {
  constructor() {
    console.log('initialized account manager');
  }

  public async getAccount(username: string): Promise<IAccount | undefined> {
    return Account.findOne({ username });
  }

  public async getAccounts(): Promise<IAccount[] | undefined> {
    let allAccounts = undefined;
    try {
      console.log("getAccounts is read in accountManager");
      allAccounts = await Account.find();
      if (allAccounts === undefined) {
        return undefined;
      }
      return allAccounts;
    } catch (error) {
      console.error(error);
    }
    // return allAccounts;
  }

  public async authorizeAccount(username: string, password?: string): Promise<boolean | undefined> {

    const fromDB = await this.getAccount(username);

    if (fromDB === undefined) {
      return undefined;
    }
    // if (fromDB) return true;


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

  public async deleteAccount(username: string): Promise<void> {
    try {
      await Account.remove({ username });
    } catch (error) {
      console.error(error);
    }
  }

};