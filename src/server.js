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
const dotenv = __importStar(require("dotenv"));
const account_controller_1 = __importDefault(require("./routes/account.controller"));
const index_1 = __importDefault(require("./app/index"));
const marketData_controller_1 = __importDefault(require("./routes/marketData.controller"));
dotenv.config();
const routes = [
    {
        path: "/accounts",
        controller: new account_controller_1.default(),
    },
    {
        path: '/market-cap',
        controller: new marketData_controller_1.default()
    }
];
const app = new index_1.default(routes);
app.listen(3000);
// const app: Application = express();
// const PORT = 3000;
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/accounts", accountsRoute);
// const setupMongoose = () => {
// try {
//   mongoose.connect(
//     process.env.DB_CONNECTION_URI ?? "",
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => console.log("Connected to the DB")
//   );
// } catch (e) {
//   console.log("could not connect");
// }
// };
// setupMongoose();
// app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
