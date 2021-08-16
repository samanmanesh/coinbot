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
const Account_1 = __importDefault(require("../models/Account"));
class AccountManager {
    constructor() {
    }
    getAccount(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let requiredAccount = undefined;
            try {
                requiredAccount = Account_1.default.findOne({ username });
                if (requiredAccount === undefined) {
                    return undefined;
                }
            }
            catch (error) {
                // throw new Error(error);
                console.error(error.message);
            }
            return requiredAccount;
            // return Account.findOne({ username });
        });
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            let allAccounts = undefined;
            try {
                console.log("getAccounts is read in accountManager");
                allAccounts = yield Account_1.default.find();
                if (allAccounts === undefined) {
                    return undefined;
                }
                // return allAccounts;
            }
            catch (error) {
                console.error(error);
                // throw new Error(error);
            }
            return allAccounts;
        });
    }
    authorizeAccount(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromDB = yield this.getAccount(username);
            if (fromDB === undefined) {
                return undefined;
            }
            if (fromDB)
                return true;
            // if (password === undefined) {
            //   return fromDB.password === undefined;
            // }
            // return fromDB.password === password;
        });
    }
    createAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                account = yield Account_1.default.save(account);
            }
            catch (error) {
                console.error(error);
            }
            return account;
        });
    }
    updateAccount(username, account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Account_1.default.updateOne({ username }, account);
            }
            catch (error) {
                console.error(error);
                // throw new Error(error);
            }
            return account;
        });
    }
    deleteAccount(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Account_1.default.remove({ username });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = AccountManager;
;
