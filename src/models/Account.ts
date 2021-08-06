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