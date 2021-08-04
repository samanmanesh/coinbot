import express, { Request, Response, NextFunction } from "express";
import Account, { IAccount } from "../models/Account";
import { IController } from "../types";

enum AccountPath {
  Base = "/",
  ByUsername = "/:username",
}

export default class AccountController implements IController {
  public router = express.Router();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get(AccountPath.Base, this.getAllAccounts);

    this.router.get(
      AccountPath.ByUsername,
      this.getAccountByUsernameMiddleware,
      this.getAccountByUsername
    );

    this.router.post(AccountPath.Base, this.addAccount);

    this.router.delete(
      AccountPath.ByUsername,
      this.deleteAccount
    );

    this.router.patch(AccountPath.ByUsername, this.updateAccount);
  }

  async getAllAccounts(req: Request, res: Response) {
    try {
      const allAccounts = await Account.find();
      console.log("all accounts", allAccounts);
      res.status(200).json(allAccounts);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  getAccountByUsername(req: Request, res: Response) {
    res.json(res.account);
  }

  async addAccount(req: Request, res: Response) {
    const fromDB = await Account.findOne({
      username: req?.body?.username ?? "",
    });
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
      const savedAccount = await Account.save(newAccount);
      res.status(201).json(savedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const removedAccount = await Account.remove({ username });
      res.status(201).json(removedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateAccount(req: Request, res: Response) {
    // if (req?.body?.name != null) {
    //   res.account.name = req.body.name;
    // }
    // if (req?.body?.api != null) {
    //   res.account.api = req.body.api;
    // }

    try {
      // const updatedAccount = await res.account.save();
      const updatedAccount = await Account.updateOne(
        { username: req.params.username },
        req.body
      );
      res.status(200).json(updatedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Helper function
  async getAccountByUsernameMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let account = null;
    try {
      account = await Account.findOne({ username: req.params.username });
      if (account === null) {
        return res.status(404).json({ message: "Account not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.account = account;
    next();
  }
}
