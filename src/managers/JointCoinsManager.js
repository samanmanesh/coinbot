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
const jointCoins_1 = __importDefault(require("../models/jointCoins"));
class JointCoinsManager {
    constructor() { }
    createJointCoin(jointCoin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                jointCoin = yield jointCoins_1.default.save(jointCoin);
            }
            catch (error) {
                console.error(error.message);
            }
            return jointCoin;
        });
    }
    getJointCoins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield jointCoins_1.default.find();
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    getJointCoin(coinSymbol) {
        return __awaiter(this, void 0, void 0, function* () {
            let requiredCoin = undefined;
            try {
                requiredCoin = yield jointCoins_1.default.findOne({ coinSymbol });
                return requiredCoin;
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    deleteJointCoin(coinSymbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield jointCoins_1.default.remove({ coinSymbol: coinSymbol });
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    updateJointCoin(coinSymbol, newJointCoin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield jointCoins_1.default.updateOne({ coinSymbol }, newJointCoin);
                ;
            }
            catch (error) {
                console.error(error.message);
            }
            return newJointCoin;
        });
    }
    addAccountToJointCoinsAccounts(coinSymbol, account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield jointCoins_1.default.addToArray({ coinSymbol }, "accounts", account);
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    removeAccountFromJointCoinsAccounts(coinSymbol, account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield jointCoins_1.default.removeFromArray({ coinSymbol }, "accounts", account);
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    addAccountCoinsToJointCoin(coinsSymbols, account) {
        return __awaiter(this, void 0, void 0, function* () {
            //for adding the new account to related coins in JointCoins collection
            try {
                yield coinsSymbols.forEach((coinSymbol) => {
                    jointCoins_1.default.addToArray({ coinSymbol }, "accounts", account);
                });
                console.log("coinsSymbols", coinsSymbols);
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    deleteJointCoinAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // Deleting a deleted account from all coins which hold it
        });
    }
}
exports.default = JointCoinsManager;
//   try {
//     allJointCoins &&
//       await allJointCoins.forEach( () => {
//         // console.log("coinsSymbols are",coinsSymbols.coinSymbol);
//         JointCoins.removeFromArrays({}, "accounts", account);
//       });
//     // console.log("coinsSymbols");
//   } catch (error) {
//     console.error(error.message);
//   }
// }
//   {
//     for ( let coin of coinsSymbols ) {
//     try {
//       await JointCoins.addToArray({ coin }, "accounts", account);
//     } catch (error) {
//       console.error(error.message);
//     }
//   }
// }
// public async updateJointCoinAccount(coinSymbol: string, newAccount: string) {
// const preJointCoin = await this.getJointCoin(coinSymbol);
// if (!preJointCoin) return;
// const accountsSet = new Set(preJointCoin.accounts);
// accountsSet.add(newAccount);
// const accountsArray = Array.from(accountsSet);
// console.log("accountArraySet is" , accountsArray)
// const newJointCoin = { ...preJointCoin, accounts: accountsArray };
///////////////////////////////
// try {
//   await JointCoins.addToArray({ coinSymbol }, "accounts", newAccount);
// }
// catch (error) {
//   console.error(error.message);
// }
// }
