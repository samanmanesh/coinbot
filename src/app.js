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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const accounts_1 = __importDefault(require("./routes/accounts"));
// import bodyParser from 'body-parser';
dotenv.config();
const app = express_1.default();
const PORT = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/accounts", accounts_1.default);
const setupMongoose = () => {
    var _a;
    try {
        mongoose_1.default.connect((_a = process.env.DB_CONNECTION_URI) !== null && _a !== void 0 ? _a : "", { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to the DB"));
    }
    catch (e) {
        console.log("could not connect");
    }
};
setupMongoose();
app.get("/", (req, res) => {
    res.send(`'Hello world'`);
});
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
