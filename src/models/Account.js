"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AccountSchema = new mongoose_1.Schema({
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
            deposit: String,
            currency: String,
        },
        coins: {
            symbol: String,
            volume: Number,
            buy_at: Number,
        },
    },
});
const Account = mongoose_1.model("Account", AccountSchema, "accounts");
exports.default = Account;
