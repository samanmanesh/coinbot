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
const JointCoinsManager_1 = __importDefault(require("../managers/JointCoinsManager"));
var RouteNames;
(function (RouteNames) {
    RouteNames["Base"] = "/";
    RouteNames["BySymbol"] = "/:symbol";
})(RouteNames || (RouteNames = {}));
class CommonCoinsController {
    constructor() {
        this.router = express_1.default.Router();
        this.jointCoinsManager = new JointCoinsManager_1.default();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.post(RouteNames.Base, (req, res) => this.addNewCommonCoin(req, res));
        this.router.get(RouteNames.Base, (req, res) => this.getAllCommonCoins(req, res));
        this.router.get(RouteNames.BySymbol, (req, res) => this.getCommonCoin(req, res));
        this.router.delete(RouteNames.BySymbol, (req, res) => this.deleteCommonCoin(req, res));
        this.router.put(RouteNames.BySymbol, (req, res) => this.updateCommonCoin(req, res));
        this.router.patch(RouteNames.BySymbol, (req, res) => this.updateCommonCoinAccount(req, res));
    }
    addNewCommonCoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCoin = {
                coinName: req.body.coinName,
                coinSymbol: req.body.coinSymbol,
                accounts: req.body.accounts
            };
            try {
                const savedNewCoin = yield this.jointCoinsManager.createJointCoin(newCoin);
                res.status(200).send(savedNewCoin);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getAllCommonCoins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCommonCoins = yield this.jointCoinsManager.getJointCoins();
                res.status(200).send(allCommonCoins);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getCommonCoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commonCoin = yield this.jointCoinsManager.getJointCoin(req.params.symbol);
                res.status(200).send(commonCoin);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteCommonCoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedCoin = yield this.jointCoinsManager.deleteJointCoin(req.params.symbol);
                res.status(200).send(deletedCoin);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateCommonCoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCoin = yield this.jointCoinsManager.updateJointCoin(req.params.symbol, req.body);
                res.status(200).send(updatedCoin);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateCommonCoinAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCoin = yield this.jointCoinsManager.updateJointCoinAccount(req.params.symbol, req.body.accounts);
                res.status(200).send(updatedCoin);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = CommonCoinsController;
