import { Document, Schema, model } from "mongoose";

export interface IAccount extends Document {
  name: string;
  api: string;
  date: Date;
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
      symbol: { type: String, required: false },
      volume: { type: Number, required: false },
      buy_at: { type: Number, required: false },
    },
  },
});

const Account = model<IAccount>("Account", AccountSchema, "accounts");

export default Account;
