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
const CoinBotContext_1 = __importDefault(require("../context/CoinBotContext"));
class App {
    constructor(routes) {
        this.app = express_1.default();
        this._context = new CoinBotContext_1.default();
        this.setupMiddleware();
        this.setupRoutes(routes);
        this.app.get("/", (req, res) => {
            res.send(`'Hello world'`);
        });
        this.app.get("/play", this.setupCron.bind(this));
        // this.setupCron();
    }
    listen(port) {
        this.app.listen(port, () => console.log(`App is listening on port ${port}`));
    }
    setupMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    setupRoutes(routes) {
        routes.forEach((route) => {
            this.app.use(route.path, route.controller.router);
        });
    }
    setupCron(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._context.runCron();
                res.status(200).send("Cron is running");
            }
            catch (err) {
                console.error({ message: err });
            }
        });
    }
}
exports.default = App;
