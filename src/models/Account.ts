import { Document, Schema, model } from "mongoose";
import { IWalletCoin, IAccountAssets } from "../types";
export interface IAccount extends Document {
  name: string;
  api: string;
  date: Date;
  preferred_coins: string[];
  assets: IAccountAssets;
}

const AccountSchema = new Schema<IAccount>({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  api: {
    type: String,
    required: [true, "API is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  preferred_coins: {
    type: Array,
    required: [true, "At least one Preferred Coin is required"],
  },
  assets: {
    wallet: {
      deposit: { type: String, required: false },
      currency: { type: String, required: false },
    },
    coins: {
      type: Array,
    },
  },
});

const Account = model<IAccount>("Account", AccountSchema, "accounts");

export default Account;
