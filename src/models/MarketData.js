"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("../database/Model"));
const MarketData = Model_1.default("market-data");
exports.default = MarketData;
// Old Version: using Schema for mongoose
// const MarketDataSchema = new Schema<IMarketData>({
//   date_added: {
//     type: Date,
//     required: [true, "Date is required"],
//   },
//   coins: {
//     type: Array,
//     required: [true, "Coins is required"],
//   },
// });
// const MarketData = model<IMarketData>(
//   "MarketData",
//   MarketDataSchema,
//   "market-data"
// );
