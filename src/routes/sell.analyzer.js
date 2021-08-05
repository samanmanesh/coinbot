"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_controller_1 = require("./account.controller");
var SellAnalyzerPath;
(function (SellAnalyzerPath) {
    SellAnalyzerPath["Base"] = "/";
})(SellAnalyzerPath || (SellAnalyzerPath = {}));
class SellAnalyzer {
    // accountControllerInstance = new AccountController();
    constructor() {
        this.router = express_1.default.Router();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get(SellAnalyzerPath.Base, this.analyze);
    }
    analyze(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // throw new Error("Not implemented.");
            //Todo first gets the data related to accounts from data base
            try {
                // const accountsList = await this.accountControllerInstance.   getAllAccounts();
                const accountList = yield account_controller_1.getAllAccounts();
                res.status(200).json(accountList);
                console.log("acccountList is", accountList);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
            //Todo then gets the data for preferred_coins for each account from the data base
        });
    }
}
exports.default = SellAnalyzer;
