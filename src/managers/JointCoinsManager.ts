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

    try {
      await JointCoins.updateOne({ coinSymbol }, newJointCoin);
      ;
    } catch (error) {
      console.error(error.message);
    }
    return newJointCoin;
  }

  public async addAccountToJointCoin(coinSymbol: string, account: string) {
    try {
      await JointCoins.addToArray({ coinSymbol }, "accounts", account);
    } catch (error) {
      console.error(error.message);
    }
  }

  public async removeAccountFromJointCoin(coinSymbol: string, account: string) {
    try {
      await JointCoins.removeFromArray({ coinSymbol }, "accounts", account);
    } catch (error) {
      console.error(error.message);
    }
  }


  public async addAccountCoinsToJointCoin(coinsSymbols: string[], account: string) {

    //for adding the new account to related coins in JointCoins collection

    try {
      await coinsSymbols.forEach((coinSymbol) => {
        JointCoins.addToArray({ coinSymbol }, "accounts", account);
      })
      console.log("coinsSymbols", coinsSymbols);
    } catch (error) {
      console.error(error.message);
    }
  }

  public async deleteJointCoinAccount( account: string) {

    // Deleting a deleted account from all coins which hold it
    

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
