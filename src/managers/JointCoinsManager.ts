import { ReturnDocument } from "mongodb";
import jointCoins from "../models/jointCoins";
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
  // public async addAccountToJointCoinsAccounts(coinSymbol: string, account: string) {

  //   try {
  //     return await JointCoins.addToArray({ coinSymbol }, "accounts", account);

  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }

  //Adding a new account to its related coins
  //Todo it is going to get an array of preferred Coins and an array of accounts name in case the it gives both requests 
  public async addAccountToJointCoinsAccounts(coinSymbol: string[], account: string) {

    let jointCoins = await this.getJointCoins();
    if (!jointCoins) return;

    try {
      for (let coin in coinSymbol) {

        for (let jointCoin in jointCoins)
          if (jointCoins[jointCoin].coinSymbol === coinSymbol[coin]) {
            let requiredCoinSymbol = coinSymbol[coin]
            jointCoins[jointCoin].accounts.push(account);

            await JointCoins.addToArray({ coinSymbol: requiredCoinSymbol }, "accounts", account);
            // await JointCoins.addToArray({ coin }, "accounts", account);
          }
      }
      // console.log("check", jointCoins);
    } catch (error) {
      console.error(error.message);
    }
  }



  // Removing a new account to related coins in JointCoins accounts array 
  public async removeAccountFromJointCoinsAccounts(coinSymbol: string, account: string) {
    try {
      return await JointCoins.removeFromArray({ coinSymbol }, "accounts", account);
    } catch (error) {
      console.error(error.message);
    }
  }


}



  //   try {
  //     allJointCoins &&
  //       await allJointCoins.forEach( () => {
  //         // console.log("coinsSymbols are",coinsSymbols.coinSymbol);
  //         JointCoins.removeFromArrays({}, "accounts", account);
  //       });


  //     // console.log("coinsSymbols");
  //   } catch (error) {
  //     console.error(error.message);
  //   }

  // }
  //   {
  //     for ( let coin of coinsSymbols ) {
  //     try {
  //       await JointCoins.addToArray({ coin }, "accounts", account);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   }

  // }
  // public async updateJointCoinAccount(coinSymbol: string, newAccount: string) {


  // const preJointCoin = await this.getJointCoin(coinSymbol);
  // if (!preJointCoin) return;
  // const accountsSet = new Set(preJointCoin.accounts);
  // accountsSet.add(newAccount);
  // const accountsArray = Array.from(accountsSet);
  // console.log("accountArraySet is" , accountsArray)
  // const newJointCoin = { ...preJointCoin, accounts: accountsArray };
  ///////////////////////////////

  // try {
  //   await JointCoins.addToArray({ coinSymbol }, "accounts", newAccount);
  // }
  // catch (error) {
  //   console.error(error.message);
  // }

  // }
