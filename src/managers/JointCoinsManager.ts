import { ReturnDocument } from "mongodb";
import JointCoins, { ICoins } from "../models/jointCoins"

export default class JointCoinsManager {
  constructor() { }

  public async createJointCoin(jointCoin: ICoins) {

    try {
      jointCoin = await JointCoins.save(jointCoin);
    } catch (error) {
      console.error(error.message);
    }
    return jointCoin;
  }

  public async getJointCoins() {
    try {
      return await JointCoins.find();
    } catch (error) {
      console.error(error.message);
    }
  }

  public async getJointCoin(coinSymbol: string) {
    let requiredCoin = undefined;
    try {
      requiredCoin = await JointCoins.findOne({ coinSymbol });
      return requiredCoin;
    } catch (error) {
      console.error(error.message);
    }
  }

  public async deleteJointCoin(coinSymbol: string) {

    try {
      await JointCoins.remove({ coinSymbol: coinSymbol });
    } catch (error) {
      console.error(error.message);
    }
  }

  public async updateJointCoin(coinSymbol: string, newJointCoin: ICoins): Promise<ICoins | undefined> {

    // const preJointCoin = await this.getJointCoin(coinSymbol);
    // if (!preJointCoin) return undefined;
    // const updatedJointCoin = { ...preJointCoin, newJointCoin };

    try {
      await JointCoins.updateOne({ coinSymbol }, newJointCoin);
      ;
    } catch (error) {
      console.error(error.message);
    }
    return newJointCoin;
  }

  public async updateJointCoinAccount(coinSymbol: string, newAccount: string): Promise<ICoins | undefined>  {

      // const preJointCoin = await this.getJointCoin(coinSymbol);
      // if (!preJointCoin) return;
      // preJointCoin.accounts.push(newAccount);

      // const newJointCoinAccounts = await {...preJointCoin, account: newAccount}; 
    const preJointCoin = await this.getJointCoin(coinSymbol);
    if (!preJointCoin) return;
    const accountsSet = new Set(preJointCoin.accounts);
    accountsSet.add(newAccount);
    const accountsArray = Array.from(accountsSet);
    console.log("accountArraySet is" , accountsArray)
    const newJointCoin = { ...preJointCoin, accounts: accountsArray };

    try {
      // return await JointCoins.addToArray({ coinSymbol }, accountArraySet);
      //  return await JointCoins.addToArray({ coinSymbol }, newAccount);
    }
    catch (error) {
      console.error(error.message);
    }

  }
}