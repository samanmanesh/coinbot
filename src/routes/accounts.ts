import express, { Request, Response, NextFunction } from "express";
import Account, { IAccount } from "../models/Account";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const allAccounts = await Account.find();
    res.status(201).json(allAccounts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Getting a specific account
router.get("/:accountId", getAccountId, (req: Request, res: Response) => {
  res.json(res.account);
});

// Create a new account
router.post("/", async (req: Request, res: Response) => {
  const newAccount = new Account({
    name: req?.body?.name ?? 'undefined',
    api: req?.body?.api ?? 'undefined',
  });

  try {
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleting a account from
router.delete(
  "/:accountId",
  getAccountId,
  async (req: Request, res: Response) => {
    try {
      const removedAccount = await res.account.remove();
      res.status(201).json(removedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update an account
router.patch(
  "/:accountId",
  getAccountId,
  async (req: Request, res: Response) => {
    // const account: IAccount = res.account;
    if (req?.body?.name != null) {
      res.account.name = req.body.name;
    }
    if (req?.body?.api != null) {
      res.account.api = req.body.api;
    }

    try {
      const updatedAccount = await res.account.save();
      res.status(200).json(updatedAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

async function getAccountId(req: Request, res: Response, next: NextFunction) {
  let account = null;
  try {
    account = await Account.findById(req.params.accountId);
    if (account === null) {
      return res.status(404).json({ message: "Account not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.account = account;
  next();
}

export default router;
