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
const Account_1 = __importDefault(require("../models/Account"));
var AccountPath;
(function (AccountPath) {
    AccountPath["Base"] = "/";
    AccountPath["ByID"] = "/:accountId";
})(AccountPath || (AccountPath = {}));
class AccountController {
    constructor() {
        this.router = express_1.default.Router();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get(AccountPath.Base, this.getAllAccounts);
        this.router.get(AccountPath.ByID, this.getAccountByIDMiddleware, this.getAccountById);
        this.router.post(AccountPath.Base, this.addAccount);
        this.router.delete(AccountPath.ByID, this.getAccountByIDMiddleware, this.deleteAccount);
        this.router.patch(AccountPath.ByID, this.updateAccount);
    }
    getAllAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allAccounts = yield Account_1.default.find();
                res.status(201).json(allAccounts);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getAccountById(req, res) {
        res.json(res.account);
    }
    addAccount(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const newAccount = new Account_1.default({
                name: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.name,
                api: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.api,
            });
            try {
                const savedAccount = yield newAccount.save();
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
                const removedAccount = yield res.account.remove();
                res.status(201).json(removedAccount);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateAccount(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.name) != null) {
                res.account.name = req.body.name;
            }
            if (((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.api) != null) {
                res.account.api = req.body.api;
            }
            try {
                const updatedAccount = yield res.account.save();
                res.status(200).json(updatedAccount);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Helper function
    getAccountByIDMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = null;
            try {
                account = yield Account_1.default.findById(req.params.accountId);
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
