import { Document, Schema } from "mongoose";
import { IWalletCoin, IAccountAssets } from "../types";
import model from "../database/Model";
export interface IAccount {
  username: string;
  api: string;
  preferred_coins: string[];
  assets: IAccountAssets;
}

const Account = model<IAccount>("accounts");

export default Account;

// const AccountSchema = new Schema<IAccount>({
//   username: {
//     type: String,
//     required: [true, "Name is required"],
//   },
//   api: {
//     type: String,
//     required: [true, "API is required"],
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   preferred_coins: {
//     type: Array,
//     required: [true, "At least one Preferred Coin is required"],
//   },
//   assets: {
//     wallet: {
//       deposit: { type: String, required: false },
//       currency: { type: String, required: false },
//     },
//     coins: {
//       type: Array,
//     },
//   },
// });

// const Account = new Model<IAccount>('Account', 'accounts');
