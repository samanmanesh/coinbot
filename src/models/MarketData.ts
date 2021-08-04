import { Document, Schema, model } from "mongoose";
import { ICoinData } from "../types";


export interface IMarketData extends Document {
  date_added: Date;
  coins: ICoinData[];
}

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

const MarketData = model<IMarketData>(
  "MarketData",
  MarketDataSchema,
  "market-data"
);

export default MarketData;