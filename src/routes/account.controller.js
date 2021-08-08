"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const AccountManager_1 = __importStar(require("../managers/AccountManager"));
var AccountPath;
(function (AccountPath) {
    AccountPath["Base"] = "/";
    AccountPath["ByUsername"] = "/:username";
})(AccountPath || (AccountPath = {}));
class AccountController {
    constructor() {
        // accountManager = new AccountManager();
        this.router = express_1.default.Router();
        // accountManager = new AccountManager();
        this.accountManager = new AccountManager_1.default();
        this.setupRoutes();
        // this.accountManager = new AccountManager();
    }
    setupRoutes() {
        this.router.get(AccountPath.Base, this.getAllAccounts, this.getAllAccountsResponse);
        this.router.get(AccountPath.ByUsername, this.getAccount);
        this.router.post(AccountPath.Base, this.addAccount);
        this.router.delete(AccountPath.ByUsername, this.deleteAccount);
        this.router.patch(AccountPath.ByUsername, this.updateAccount);
    }
    getAllAccounts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // let accounts = undefined;
            try {
                console.log("getAllAccounts is read");
                // accounts = await this.accountManager.getAccounts();
                const accounts = yield AccountManager_1.getAccounts();
                res.sendStatus(200).send(accounts);
            }
            catch (error) {
                res.sendStatus(500).send(error);
            }
            next();
            ////Problem with this.accountManager.getAccounts() or calling a method on the manager or even here!! It is not working!!
            ////Direct way works
            // let allAccounts = undefined;
            // try {
            //   console.log("getAccounts is read in accountManager");
            //   allAccounts = await Account.find();
            //   res.status(200).send(allAccounts);
            // } catch (error) {
            //   console.error(error);
            // }
        });
    }
    getAllAccountsResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (req, res) => {
                res.status(200).send("getAllAccountsResponse");
            };
        });
    }
    getAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            try {
                // const account = await this.accountManager.getAccount(username);
                const account = yield this.accountManager.getAccount(username);
                res.status(200).json(account);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    addAccount(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            const username = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : "";
            // const fromDB = await this.accountManager.getAccount(username);
            const fromDB = yield this.accountManager.authorizeAccount(username);
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
            try {
                const { username } = req.params;
                yield this.accountManager.deleteAccount(username);
                res.status(201);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
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
}
exports.default = AccountController;
