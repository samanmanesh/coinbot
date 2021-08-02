"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MarketDataSchema = new mongoose_1.Schema({
    date_added: {
        type: Date,
        required: [true, "Date is required"],
    },
    coins: {
        type: Array,
        required: [true, "Coins is required"],
    },
});
const MarketData = mongoose_1.model("MarketData", MarketDataSchema, "market-data");
exports.default = MarketData;
