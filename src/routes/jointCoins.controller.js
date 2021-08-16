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
})(RouteNames || (RouteNames = {}));
class CommonCoinsController {
    constructor() {
        this.router = express_1.default.Router();
        this.jointCoinsManager = new JointCoinsManager_1.default();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.post(RouteNames.Base, (req, res) => this.addNewCommonCoin(req, res));
    }
    addNewCommonCoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCoin = {
                coinName: req.body.coinName,
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
}
exports.default = CommonCoinsController;
