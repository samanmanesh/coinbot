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
      return await JointCoins.remove({ coinSymbol: coinSymbol });
    } catch (error) {
      console.error(error.message);
    }
  }

  public async updateJointCoin(coinSymbol: string, desiredSection: string, newData: string): Promise<ICoins | undefined | string> {

    // updating the desire keys in ICoins Object except accounts arrays
    try {
      await JointCoins.updateOnesElement({ coinSymbol }, desiredSection, newData);
      ;
    } catch (error) {
      console.error(error.message);
    }
    return newData;
  }

  // Adding a new account to related coins in JointCoins accounts array  
  public async addAccountToJointCoinsAccounts(coinSymbol: string[], account: string) {

    let jointCoins = await this.getJointCoins();
    if (!jointCoins) return;

    try {
      for (let coin in coinSymbol) {

        for (let jointCoin in jointCoins)
          if (jointCoins[jointCoin].coinSymbol === coinSymbol[coin]) {
            let requiredCoinSymbol = coinSymbol[coin]
            // jointCoins[jointCoin].accounts.push(account);

            await JointCoins.addToArray({ coinSymbol: requiredCoinSymbol }, "accounts", account);
          }
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  // Removing a new account to related coins in JointCoins accounts array 
  public async removeAccountFromJointCoinsAccounts(coinSymbol: string[], account: string) {
    let jointCoins = await this.getJointCoins();
    if (!jointCoins) return;

    try {
      for (let coin in coinSymbol) {

        for (let jointCoin in jointCoins)
          if (jointCoins[jointCoin].coinSymbol === coinSymbol[coin]) {
            let requiredCoinSymbol = coinSymbol[coin]

            await JointCoins.removeFromArray({ coinSymbol: requiredCoinSymbol }, "accounts", account);
          }
      }
    } catch (error) {
      console.error(error.message);
    }
  }


}



