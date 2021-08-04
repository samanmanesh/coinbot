"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
class App {
    constructor(routes) {
        this.app = express_1.default();
        this.setupMiddleware();
        this.setupRoutes(routes);
        // this.setupMongoose();
        this.app.get("/", (req, res) => {
            res.send(`'Hello world'`);
        });
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
    setupMongoose() {
        var _a;
        try {
            mongoose_1.default.connect((_a = process.env.DB_CONNECTION_URI) !== null && _a !== void 0 ? _a : "", 
            // { useNewUrlParser:  useUnifiedTopology: true },
            () => console.log("Connected to the DB"));
        }
        catch (e) {
            console.log("could not connect");
        }
    }
}
exports.default = App;
