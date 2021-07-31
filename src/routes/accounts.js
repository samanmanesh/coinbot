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
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allAccounts = yield Account_1.default.find();
        res.status(201).json(allAccounts);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Getting a specific account
router.get("/:accountId", getAccountId, (req, res) => {
    res.json(res.account);
});
// Create a new account
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const newAccount = new Account_1.default({
        name: (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'undefined',
        api: (_d = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.api) !== null && _d !== void 0 ? _d : 'undefined',
    });
    try {
        const savedAccount = yield newAccount.save();
        res.status(201).json(savedAccount);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Deleting a account from
router.delete("/:accountId", getAccountId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removedAccount = yield res.account.remove();
        res.status(201).json(removedAccount);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Update an account
router.patch("/:accountId", getAccountId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    // const account: IAccount = res.account;
    if (((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.name) != null) {
        res.account.name = req.body.name;
    }
    if (((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.api) != null) {
        res.account.api = req.body.api;
    }
    try {
        const updatedAccount = yield res.account.save();
        res.status(200).json(updatedAccount);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
function getAccountId(req, res, next) {
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
exports.default = router;
