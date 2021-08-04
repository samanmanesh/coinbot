import { ICoinData } from "../types";
import model from "../database/Model";

export interface IMarketData  {
  date_added: Date;
  coins: ICoinData[];
}
const MarketData = model<IMarketData>("market-data");

export default MarketData;


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
