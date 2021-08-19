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
const AccountManager_1 = __importDefault(require("../managers/AccountManager"));
const JointCoinsManager_1 = __importDefault(require("../managers/JointCoinsManager"));
var AccountPath;
(function (AccountPath) {
    AccountPath["Base"] = "/";
    AccountPath["ByUsername"] = "/:username";
    AccountPath["ByUserAndPreferredCoins"] = "/:username/:preferredCoins";
    AccountPath["ByUserAndAssetsCoins"] = "/:username/:assets/:coins";
})(AccountPath || (AccountPath = {}));
class AccountController {
    constructor() {
        this.router = express_1.default.Router();
        this.accountManager = new AccountManager_1.default();
        this.jointCoinsManager = new JointCoinsManager_1.default();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get(AccountPath.Base, (req, res) => this.getAllAccounts(req, res));
        this.router.get(AccountPath.ByUsername, this.getAccount.bind(this));
        this.router.post(AccountPath.Base, (req, res) => this.addAccount(req, res));
        this.router.delete(AccountPath.ByUsername, (req, res) => this.deleteAccount(req, res));
        this.router.patch(AccountPath.ByUsername, (req, res) => this.updateAccount(req, res));
        this.router.put(AccountPath.ByUsername, (req, res) => this.addPreferredCoins(req, res));
        this.router.delete(AccountPath.ByUserAndPreferredCoins, (req, res) => this.removePreferredCoins(req, res));
        this.router.put(AccountPath.ByUserAndAssetsCoins, (req, res) => this.addAssetCoins(req, res));
    }
    getAllAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let accounts = undefined;
            try {
                console.log("getAllAccounts is read");
                accounts = yield this.accountManager.getAccounts();
                res.status(200).send(accounts);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    getAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            try {
                const account = yield this.accountManager.getAccount(username);
                if (account === undefined) {
                    res.status(200).send("message: account does not exists");
                }
                res.status(200).json(account);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    addAccount(req, res) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            const username = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : "";
            const fromDB = yield this.accountManager.authorizeAccount(username);
            if (fromDB) {
                res.status(404).send("User already exists");
                return;
            }
            const newAccount = {
                username: (_d = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.username) !== null && _d !== void 0 ? _d : "",
                password: (_f = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.password) !== null && _f !== void 0 ? _f : "",
                api: (_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.api,
                preferred_coins: [],
                assets: {
                    wallet: {
                        deposit: "",
                        currency: "CAD",
                    },
                    coins: [],
                },
            };
            try {
                const savedAccount = yield this.accountManager.createAccount(newAccount);
                res.status(201).json(savedAccount);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            try {
                yield this.accountManager.deleteAccount(username);
                res.status(201).send("Account deleted");
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
            // try { 
            //   await this.jointCoinsManager.deleteJointCoinAccount(username);
            //   console.log("Updated jointCoin");
            // }catch (error) {  
            //   res.status(400).json({ message: error.message });
            // }
        });
    }
    updateAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedAccount = yield this.accountManager.updateAccount(req.params.username, req.body);
                res.status(200).json(updatedAccount);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Controlling the PreferredCoins
    addPreferredCoins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            const preferredCoins = req.body.preferred_coins;
            try {
                const result = yield this.accountManager.addPreferredCoinsHandler(username, preferredCoins);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
            // Add this username for coins in jointCoins too
            try {
                yield this.jointCoinsManager.addAccountToJointCoinsAccounts(preferredCoins, username);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    removePreferredCoins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            const preferredCoins = req.body.preferred_coins;
            try {
                const result = yield this.accountManager.removePreferredCoinsHandler(username, preferredCoins);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Controlling the assets 
    addAssetCoins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = AccountController;
