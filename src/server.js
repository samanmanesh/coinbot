"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_controller_1 = __importDefault(require("./routes/account.controller"));
const index_1 = __importDefault(require("./app/index"));
const marketData_controller_1 = __importDefault(require("./routes/marketData.controller"));
const sell_analyzer_1 = __importDefault(require("./routes/sell.analyzer"));
const routes = [
    {
        path: "/accounts",
        controller: new account_controller_1.default(),
    },
    {
        path: "/market-cap",
        controller: new marketData_controller_1.default(),
    },
    {
        path: "/sell-analyzer",
        controller: new sell_analyzer_1.default(),
    },
];
const app = new index_1.default(routes);
app.listen(3000);
