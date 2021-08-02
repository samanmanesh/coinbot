"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AccountSchema = new mongoose_1.Schema({
    name: {
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
});
const Account = mongoose_1.model("Account", AccountSchema, "accounts");
exports.default = Account;
