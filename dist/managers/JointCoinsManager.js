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
    updateJointCoin(coinSymbol, desiredSection, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            // updating the desire keys in ICoins Object except accounts arrays
            try {
                yield jointCoins_1.default.updateOnesElement({ coinSymbol }, desiredSection, newData);
                ;
            }
            catch (error) {
                console.error(error.message);
            }
            return newData;
        });
    }
    // Adding a new account to related coins in JointCoins accounts array  
    addAccountToJointCoinsAccounts(coinSymbol, account) {
        return __awaiter(this, void 0, void 0, function* () {
            let jointCoins = yield this.getJointCoins();
            if (!jointCoins)
                return;
            try {
                for (let coin in coinSymbol) {
                    for (let jointCoin in jointCoins)
                        if (jointCoins[jointCoin].coinSymbol === coinSymbol[coin]) {
                            let requiredCoinSymbol = coinSymbol[coin];
                            // jointCoins[jointCoin].accounts.push(account);
                            yield jointCoins_1.default.addToArray({ coinSymbol: requiredCoinSymbol }, "accounts", account);
                        }
                }
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    // Removing a new account to related coins in JointCoins accounts array 
    removeAccountFromJointCoinsAccounts(coinSymbol, account) {
        return __awaiter(this, void 0, void 0, function* () {
            let jointCoins = yield this.getJointCoins();
            if (!jointCoins)
                return;
            try {
                for (let coin in coinSymbol) {
                    for (let jointCoin in jointCoins)
                        if (jointCoins[jointCoin].coinSymbol === coinSymbol[coin]) {
                            let requiredCoinSymbol = coinSymbol[coin];
                            yield jointCoins_1.default.removeFromArray({ coinSymbol: requiredCoinSymbol }, "accounts", account);
                        }
                }
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    coinsExistenceHandler(preferredCoin) {
        return __awaiter(this, void 0, void 0, function* () {
            const preJointCoins = yield this.getJointCoins();
            if (!preJointCoins)
                return;
            const result = preJointCoins.find(c => c.coinSymbol === preferredCoin);
            if (result)
                return true;
            if (!result)
                return false;
        });
    }
}
exports.default = JointCoinsManager;
