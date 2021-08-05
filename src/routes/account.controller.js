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
exports.getAccountByUsername = exports.getAllAccounts = void 0;
const express_1 = __importDefault(require("express"));
const Account_1 = __importDefault(require("../models/Account"));
var AccountPath;
(function (AccountPath) {
    AccountPath["Base"] = "/";
    AccountPath["ByUsername"] = "/:username";
})(AccountPath || (AccountPath = {}));
function getAllAccounts(res) {
    return __awaiter(this, void 0, void 0, function* () {
        let allAccounts = undefined;
        try {
            allAccounts = yield Account_1.default.find();
            console.log("all accounts", allAccounts);
            res &&
                res.status(200).json(allAccounts);
        }
        catch (error) {
            res &&
                res.status(400).json({ message: error.message });
        }
        return allAccounts;
    });
}
exports.getAllAccounts = getAllAccounts;
function getAccountByUsername(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let account = null;
        try {
            account = yield Account_1.default.findOne({ username: req.params.username });
            res.status(200).json(account);
            if (account === null) {
                return res.status(404).json({ message: "Account not found" });
            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
        return account;
    });
}
exports.getAccountByUsername = getAccountByUsername;
class AccountController {
    constructor() {
        this.router = express_1.default.Router();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get(AccountPath.Base, this.getAllAccounts);
        this.router.get(AccountPath.ByUsername, this.getAccountByUsernameMiddleware, this.getAccountByUsername);
        this.router.post(AccountPath.Base, this.addAccount);
        this.router.delete(AccountPath.ByUsername, this.deleteAccount);
        this.router.patch(AccountPath.ByUsername, this.updateAccount);
    }
    getAllAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return getAllAccounts(res);
        });
    }
    getAccountByUsername(req, res) {
        res.json(res.account);
    }
    addAccount(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            const fromDB = yield Account_1.default.findOne({
                username: (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : "",
            });
            if (fromDB) {
                res.status(404).send("User already exists");
                return;
            }
            const newAccount = {
                username: (_d = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.username) !== null && _d !== void 0 ? _d : "",
                api: (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.api,
                preferred_coins: (_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.preferred_coins,
                assets: {
                    wallet: {
                        deposit: (_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.assets.wallet.deposit,
                        currency: (_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.assets.wallet.currency,
                    },
                    coins: [
                        {
                            symbol: (_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.assets.coins.symbol,
                            volume: (_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.assets.coins.volume,
                            buy_at: (_l = req === null || req === void 0 ? void 0 : req.body) === null || _l === void 0 ? void 0 : _l.assets.coins.buy_at,
                        },
                    ],
                },
            };
            try {
                const savedAccount = yield Account_1.default.save(newAccount);
                res.status(201).json(savedAccount);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const removedAccount = yield Account_1.default.remove({ username });
                res.status(201).json(removedAccount);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (req?.body?.name != null) {
            //   res.account.name = req.body.name;
            // }
            // if (req?.body?.api != null) {
            //   res.account.api = req.body.api;
            // }
            try {
                // const updatedAccount = await res.account.save();
                const updatedAccount = yield Account_1.default.updateOne({ username: req.params.username }, req.body);
                res.status(200).json(updatedAccount);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Helper function
    getAccountByUsernameMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = null;
            try {
                account = yield Account_1.default.findOne({ username: req.params.username });
                if (account === null) {
                    return res.status(404).json({ message: "Account not found" });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
            res.account = account;
            next();
        });
    }
}
exports.default = AccountController;
