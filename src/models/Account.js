"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("../database/Model"));
const Account = Model_1.default("accounts");
exports.default = Account;
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
