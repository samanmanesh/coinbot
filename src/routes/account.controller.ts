import { ICoins } from './../models/jointCoins';
import express, { Request, Response } from "express";
import Account, { IAccount } from "../models/Account";
import { IController } from "../types";
import AccountManager from "../managers/AccountManager";
import JointCoinsManager from '../managers/JointCoinsManager';
enum AccountPath {
  Base = "/",
  ByUsername = "/:username",
  ByActionAndUser = "/action/:username",
  ByUserAndAssets = "/assets/:username",
  ByUserAndAssetsAndCoin = "/assets/:username/:coin",
}

export default class AccountController implements IController {
  public router = express.Router();
  accountManager = new AccountManager();
  jointCoinsManager = new JointCoinsManager();
  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get(AccountPath.Base,
      (req, res) => this.getAllAccounts(req, res));

    this.router.get(AccountPath.ByUsername, this.getAccount.bind(this));


    this.router.post(AccountPath.Base, (req, res) => this.addAccount(req, res));


    this.router.delete(AccountPath.ByUsername, (req, res) => this.deleteAccount(req, res));

    this.router.patch(AccountPath.ByUsername, (req, res) => this.updateAccount(req, res));


    this.router.post(AccountPath.ByUsername, (req, res) => this.addPreferredCoins(req, res));

    this.router.delete(AccountPath.ByActionAndUser, (req, res) => this.removePreferredCoins(req, res));


    this.router.post(AccountPath.ByUserAndAssets, (req, res) => this.addCoinsToAccountsAssets(req, res));

    this.router.delete(AccountPath.ByUserAndAssetsAndCoin, (req, res) => this.removeCoinsFromAccountsAssets(req, res));

    this.router.patch(AccountPath.ByUserAndAssets, (req, res) => this.updateCoinInAccountsAssets(req, res));

    this.router.patch(AccountPath.ByUserAndAssetsAndCoin, (req, res)=> this.updateAllocatedPriceInCoins(req, res));
     

    this.router.put(AccountPath.ByUserAndAssets, (req, res) => this.updateWallet(req, res));
  }

  async getAllAccounts(req: Request, res: Response) {
    let accounts = undefined;
    try {
      accounts = await this.accountManager.getAccounts();
      res.status(200).send(accounts);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getAccount(req: Request, res: Response) {
    const { username } = req.params;
    try {
      const account = await this.accountManager.getAccount(username);
      if (account === undefined) { res.status(200).send("message: account does not exists") }
      res.status(200).json(account);

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addAccount(req: Request, res: Response) {
    const username = req?.body?.username ?? "";
    const fromDB = await this.accountManager.authorizeAccount(username);
    if (fromDB) {
      res.status(404).send("User already exists");
      return;
    }

    const newAccount: IAccount = {
      username: req?.body?.username ?? "",
      password: req?.body?.password ?? "",
      api: req?.body?.api,
      preferred_coins: [],
      assets: {
        wallet: {
          deposit: 0,
          currency: "USDT",
        },
        coins: [

        ],
      },
    };

    try {
      const savedAccount = await this.accountManager.createAccount(newAccount);
      res.status(201).json(savedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  }

  async deleteAccount(req: Request, res: Response) {
    const { username } = req.params;
    try {
      await this.accountManager.deleteAccount(username);
      res.status(201).send("Account deleted");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

    // try { 
    //   await this.jointCoinsManager.deleteJointCoinAccount(username);
    //   console.log("Updated jointCoin");
    // }catch (error) {  
    //   res.status(400).json({ message: error.message });
    // }
  }

  async updateAccount(req: Request, res: Response) {
    try {
      const updatedAccount = await this.accountManager.updateAccount(req.params.username, req.body);
      res.status(200).json(updatedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  //Todo a general update to gets required section and value to update
  // async updateAccount(req: Request, res: Response) {
  //   const desiredSection= req.params.section;

  //   try {
  //     const updatedAccount = await this.accountManager.updateAccount(req.params.username,desiredSection, req.body );
  //     res.status(200).json(updatedAccount);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // }

  // Controlling the PreferredCoins
  async addPreferredCoins(req: Request, res: Response) {
    const username = req.params.username;
    const preferredCoins = req.body.preferred_coins;

    try {
      const result = await this.accountManager.addPreferredCoinsHandler(username, preferredCoins);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

    // Check if coins in preferredCoins exists in jointCoins to add to
    try {
      for (let coin in preferredCoins) {
        const result = await this.jointCoinsManager.coinsExistenceHandler(preferredCoins[coin]);

        if (result === false) {
          const newCoin: ICoins = {
            coinSymbol: preferredCoins[coin],
            accounts: []
          }

          await this.jointCoinsManager.createJointCoin(newCoin);
        }
      }

    } catch (error) {
      console.error(error);
    }

    // Add this username for coin's accounts in jointCoins too
    try {
      await this.jointCoinsManager.addAccountToJointCoinsAccounts(preferredCoins, username);
    } catch (error) {
      console.error(error);
    }

  }

  async removePreferredCoins(req: Request, res: Response) {
    const username = req.params.username;
    const preferredCoins = req.body.preferred_coins;

    try {
      const result = await this.accountManager.removePreferredCoinsHandler(username, preferredCoins);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

    // Remove this username for coin's account in jointCoins too
    try {
      await this.jointCoinsManager.removeAccountFromJointCoinsAccounts(preferredCoins, username);

    } catch (error) {
      console.error(error);
    }

  }

  // Controlling the assets 
  async addCoinsToAccountsAssets(req: Request, res: Response) {
    const username = req?.params?.username ?? "";
    const fromDB = await this.accountManager.authorizeAccount(username);
    if (!fromDB) {
      res.status(404).send("User does not exist!");
      return;
    }

    let coin = undefined;
    // Checking if coin already exists in assets
    try {
      coin = await this.accountManager.coinExistenceCheck(username, req.body.symbol);
      if (coin) res.status(200).send("message: coins already exists");

    } catch (error) {
      console.error(error);
    }


    // Adding the coin to accounts assets if it does not exist
    try {
      if (!coin) {
        const result = await this.accountManager.addCoinToAccountsAssets(username, JSON.parse(req.body));
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }


  }

  async removeCoinsFromAccountsAssets(req: Request, res: Response) {
    const username = req?.params?.username ?? "";
    const fromDB = await this.accountManager.authorizeAccount(username);
    if (!fromDB) {
      res.status(404).send("User does not exist!");
      return;
    }

    let coin = undefined;
    // Checking if coin already exists in assets
    try {
      coin = await this.accountManager.coinExistenceCheck(username, req.params.coin);
      if (coin === false) res.status(200).send("message: coins does not exists");
    } catch (error) {
      console.error(error);
    }

    // Removing the coin from accounts assets if it exists
    try {
      if (coin === true) {
        const result = await this.accountManager.removeCoinFromAccountsAssets(username, req.params.coin);
        res.status(200).json(result);
      }
    }
    catch (error) {
      res.status(400).json({ message: error.message });
    }

  }

  async updateCoinInAccountsAssets(req: Request, res: Response) {

    const username = req?.params?.username ?? "";
    const fromDB = await this.accountManager.authorizeAccount(username);
    if (!fromDB) {
      res.status(404).send("User does not exist!");
      return;
    }

    let coin = undefined;
    // Checking if coin already exists in assets
    try {
      coin = await this.accountManager.coinExistenceCheck(username, req.body.symbol);
      if (!coin) res.status(200).send("message: coins does not exists");
    } catch (error) {
      console.error(error);
    }

    // Updating the coin in accounts assets if it exists
    try {
      if (coin) {
        const result = await this.accountManager.updateCoinInAccountsAssets(username,  req.body);
        res.status(200).json(result);
      }
    }
    catch (error) {
      res.status(400).json({ message: error.message });
    }


  }

  async updateAllocatedPriceInCoins(req: Request, res: Response) {
    const username= req?.params?.username ?? "";
    const symbol = req.params.coin;
    const newPrice = req.body.allocated_price;
    const fromDB = await this.accountManager.authorizeAccount(username);
    if (!fromDB) {
      res.status(404).send("User does not exist!");
      return;
    }

    try {
        const result = await this.accountManager.updateAllocatedPriceInCoins(username, newPrice, symbol);
        res.status(200).send(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }


  }

  async updateWallet(req: Request, res: Response){
    const username = req?.params?.username ?? "";
    const newWallet = req?.body;
    const fromDB = await this.accountManager.authorizeAccount(username);
    if (!fromDB) {
      res.status(404).send("User does not exist!");
      return;
    }

    try {
        await this.accountManager.updateWallet(username, newWallet);
        res.status(200).send("Wallet updated successfully");
    } catch (error) {
      console.error(error);
    }

  }

}
