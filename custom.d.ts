// import { IAccount } from "./src/models/Account";
declare namespace Express {
  export interface Response {
    account: IAccount;
  }
}
