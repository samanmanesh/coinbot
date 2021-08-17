import { ICoins } from './../models/jointCoins';
import express, { Request, Response } from "express";
import { IAccount } from "../models/Account";
import { IController } from "../types";
import AccountManager from "../managers/AccountManager";
import JointCoinsManager from '../managers/JointCoinsManager';
enum AccountPath {
  Base = "/",
  ByUsername = "/:username",
  PreferredCoins="/:username/:preferredCoins" ,
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
    this.router.put(AccountPath.PreferredCoins, (req, res) => this.addPreferredCoins(req, res));
  }


  async getAllAccounts(req: Request, res: Response) { 
    let accounts = undefined;
    try {
      console.log("getAllAccounts is read");
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
      preferred_coins: req?.body?.preferred_coins,
      assets: {
        wallet: {
          deposit: req?.body?.assets.wallet.deposit,
          currency: req?.body?.assets.wallet.currency,
        },
        coins: [
          {
            symbol: req?.body?.assets.coins.symbol,
            volume: req?.body?.assets.coins.volume,
            buy_at: req?.body?.assets.coins.buy_at,
          },
        ],
      },
    };

    try {
      const savedAccount = await this.accountManager.createAccount(newAccount);
      res.status(201).json(savedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

    
    // its going to be separated to another method 
    // const newJointCoinAccount = {
    //  coinsSymbol: req?.body?.preferred_coins,
    //  accounts: req.body.username 
    // }

    

    // try {
    //    await this.jointCoinsManager.addAccountCoinsToJointCoin(newJointCoinAccount.coinsSymbol, newJointCoinAccount.accounts);
    //    console.log("Updated jointCoin");
    // }catch (error) {  
    //   res.status(400).json({ message: error.message });
    // }

  }

  async deleteAccount(req: Request, res: Response) {
    const { username } = req.params;
    try {
      await this.accountManager.deleteAccount(username);
      res.status(201).send("Account deleted");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

    try { 
      await this.jointCoinsManager.deleteJointCoinAccount(username);
      console.log("Updated jointCoin");
    }catch (error) {  
      res.status(400).json({ message: error.message });
    }
  }

  async updateAccount(req: Request, res: Response) {
    try {
      const updatedAccount = await this.accountManager.updateAccount(req.params.username, req.body);
      res.status(200).json(updatedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


  async addPreferredCoins(req: Request, res: Response){
    const username = req.params.username;
    const preferredCoins = req.body.preferred_coins;

    try {
      const result = await this.accountManager.addPreferredCoinsHandler(username, preferredCoins);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

}
