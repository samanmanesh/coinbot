import express, { Request, Response } from "express";
import { IAccount } from "../models/Account";
import { IController } from "../types";
import AccountManager from "../managers/AccountManager";
import { resolvePtr } from "dns";
import Account from "../models/Account";

enum AccountPath {
  Base = "/",
  ByUsername = "/:username",
}

export default class AccountController implements IController {
  // accountManager = new AccountManager();
  public router = express.Router();
  // accountManager = new AccountManager();
  accountManager = new AccountManager();
  constructor() {
    this.setupRoutes();
    // this.accountManager = new AccountManager();
  }

  setupRoutes() {
    this.router.get(AccountPath.Base,
      (req, res) => this.getAllAccounts(req, res));

    this.router.get(AccountPath.ByUsername, this.getAccount.bind(this));

    this.router.post(AccountPath.Base, (req, res) => this.addAccount(req, res));

    this.router.delete(AccountPath.ByUsername, (req, res) => this.deleteAccount(req, res));

    this.router.patch(AccountPath.ByUsername, (req, res) => this.updateAccount(req, res));
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
      // const account = await this.accountManager.getAccount(username);
      const account = await this.accountManager.getAccount(username);
      res.status(200).json(account);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addAccount(req: Request, res: Response) {
    const username = req?.body?.username ?? "";
    // const fromDB = await this.accountManager.getAccount(username);
    const fromDB = await this.accountManager.authorizeAccount(username);
    if (fromDB) {
      res.status(404).send("User already exists");
      return;
    }

    const newAccount: IAccount = {
      username: req?.body?.username ?? "",
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
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const { username } = req.params;
      await this.accountManager.deleteAccount(username);
      res.status(201);
    } catch (error) {
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


  // Helper function
  // async getAccountByUsernameMiddleware(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   let account = null;
  //   try {
  //     account = await Account.findOne({ username: req.params.username });
  //     if (account === null) {
  //       return res.status(404).json({ message: "Account not found" });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  //   res.account = account;
  //   next();
  // }
}
