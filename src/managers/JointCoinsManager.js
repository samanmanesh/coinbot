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
                yield jointCoins_1.default.remove({ coinSymbol: coinSymbol });
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    updateJointCoin(coinSymbol, newJointCoin) {
        return __awaiter(this, void 0, void 0, function* () {
            // const preJointCoin = await this.getJointCoin(coinSymbol);
            // if (!preJointCoin) return undefined;
            // const updatedJointCoin = { ...preJointCoin, newJointCoin };
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
    updateJointCoinAccount(coinSymbol, newAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            const preJointCoin = yield this.getJointCoin(coinSymbol);
            const accountArraySet = new Set();
            accountArraySet.add(preJointCoin === null || preJointCoin === void 0 ? void 0 : preJointCoin.accounts);
            accountArraySet.add(newAccount);
            console.log("accountArraySet is", accountArraySet);
            try {
                return yield jointCoins_1.default.addToArray({ coinSymbol }, accountArraySet);
                //  return await JointCoins.addToArray({ coinSymbol }, newAccount);
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
}
exports.default = JointCoinsManager;
