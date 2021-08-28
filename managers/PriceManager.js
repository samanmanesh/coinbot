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
const web3_1 = __importDefault(require("web3"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// @ts-ignore
const IUniswapV2Factory_json_1 = __importDefault(require("@uniswap/v2-core/build/IUniswapV2Factory.json"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class PriceManager {
    constructor() {
        var _a;
        // WEB3 CONFIG
        this.web3 = new web3_1.default((_a = process.env.RPC_URL) !== null && _a !== void 0 ? _a : "");
        // Uniswap Factory Contract: https://etherscan.io/address/0xc0a47dfe034b400b47bdad5fecda2621de6c4d95#code
        this.UNISWAP_FACTORY_ADDRESS = '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95';
        // #region -- Exchange ABI --
        //@ts-ignore
        // Uniswap Exchange Template: https://etherscan.io/address/0x09cabec1ead1c0ba254b09efb3ee13841712be14#code
        this.UNISWAP_EXCHANGE_ABI = [{ "name": "TokenPurchase", "inputs": [{ "type": "address", "name": "buyer", "indexed": true }, { "type": "uint256", "name": "eth_sold", "indexed": true }, { "type": "uint256", "name": "tokens_bought", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "EthPurchase", "inputs": [{ "type": "address", "name": "buyer", "indexed": true }, { "type": "uint256", "name": "tokens_sold", "indexed": true }, { "type": "uint256", "name": "eth_bought", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "AddLiquidity", "inputs": [{ "type": "address", "name": "provider", "indexed": true }, { "type": "uint256", "name": "eth_amount", "indexed": true }, { "type": "uint256", "name": "token_amount", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "RemoveLiquidity", "inputs": [{ "type": "address", "name": "provider", "indexed": true }, { "type": "uint256", "name": "eth_amount", "indexed": true }, { "type": "uint256", "name": "token_amount", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "Transfer", "inputs": [{ "type": "address", "name": "_from", "indexed": true }, { "type": "address", "name": "_to", "indexed": true }, { "type": "uint256", "name": "_value", "indexed": false }], "anonymous": false, "type": "event" }, { "name": "Approval", "inputs": [{ "type": "address", "name": "_owner", "indexed": true }, { "type": "address", "name": "_spender", "indexed": true }, { "type": "uint256", "name": "_value", "indexed": false }], "anonymous": false, "type": "event" }, { "name": "setup", "outputs": [], "inputs": [{ "type": "address", "name": "token_addr" }], "constant": false, "payable": false, "type": "function", "gas": 175875 }, { "name": "addLiquidity", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "min_liquidity" }, { "type": "uint256", "name": "max_tokens" }, { "type": "uint256", "name": "deadline" }], "constant": false, "payable": true, "type": "function", "gas": 82616 }, { "name": "removeLiquidity", "outputs": [{ "type": "uint256", "name": "out" }, { "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "amount" }, { "type": "uint256", "name": "min_eth" }, { "type": "uint256", "name": "min_tokens" }, { "type": "uint256", "name": "deadline" }], "constant": false, "payable": false, "type": "function", "gas": 116814 }, { "name": "__default__", "outputs": [], "inputs": [], "constant": false, "payable": true, "type": "function" }, { "name": "ethToTokenSwapInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "min_tokens" }, { "type": "uint256", "name": "deadline" }], "constant": false, "payable": true, "type": "function", "gas": 12757 }, { "name": "ethToTokenTransferInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "min_tokens" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }], "constant": false, "payable": true, "type": "function", "gas": 12965 }, { "name": "ethToTokenSwapOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_bought" }, { "type": "uint256", "name": "deadline" }], "constant": false, "payable": true, "type": "function", "gas": 50463 }, { "name": "ethToTokenTransferOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_bought" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }], "constant": false, "payable": true, "type": "function", "gas": 50671 }, { "name": "tokenToEthSwapInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_sold" }, { "type": "uint256", "name": "min_eth" }, { "type": "uint256", "name": "deadline" }], "constant": false, "payable": false, "type": "function", "gas": 47503 }, { "name": "tokenToEthTransferInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_sold" }, { "type": "uint256", "name": "min_eth" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }], "constant": false, "payable": false, "type": "function", "gas": 47712 }, { "name": "tokenToEthSwapOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "eth_bought" }, { "type": "uint256", "name": "max_tokens" }, { "type": "uint256", "name": "deadline" }], "constant": false, "payable": false, "type": "function", "gas": 50175 }, { "name": "tokenToEthTransferOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "eth_bought" }, { "type": "uint256", "name": "max_tokens" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }], "constant": false, "payable": false, "type": "function", "gas": 50384 }, { "name": "tokenToTokenSwapInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_sold" }, { "type": "uint256", "name": "min_tokens_bought" }, { "type": "uint256", "name": "min_eth_bought" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "token_addr" }], "constant": false, "payable": false, "type": "function", "gas": 51007 }, { "name": "tokenToTokenTransferInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_sold" }, { "type": "uint256", "name": "min_tokens_bought" }, { "type": "uint256", "name": "min_eth_bought" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }, { "type": "address", "name": "token_addr" }], "constant": false, "payable": false, "type": "function", "gas": 51098 }, { "name": "tokenToTokenSwapOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_bought" }, { "type": "uint256", "name": "max_tokens_sold" }, { "type": "uint256", "name": "max_eth_sold" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "token_addr" }], "constant": false, "payable": false, "type": "function", "gas": 54928 }, { "name": "tokenToTokenTransferOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_bought" }, { "type": "uint256", "name": "max_tokens_sold" }, { "type": "uint256", "name": "max_eth_sold" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }, { "type": "address", "name": "token_addr" }], "constant": false, "payable": false, "type": "function", "gas": 55019 }, { "name": "tokenToExchangeSwapInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_sold" }, { "type": "uint256", "name": "min_tokens_bought" }, { "type": "uint256", "name": "min_eth_bought" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "exchange_addr" }], "constant": false, "payable": false, "type": "function", "gas": 49342 }, { "name": "tokenToExchangeTransferInput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_sold" }, { "type": "uint256", "name": "min_tokens_bought" }, { "type": "uint256", "name": "min_eth_bought" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }, { "type": "address", "name": "exchange_addr" }], "constant": false, "payable": false, "type": "function", "gas": 49532 }, { "name": "tokenToExchangeSwapOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_bought" }, { "type": "uint256", "name": "max_tokens_sold" }, { "type": "uint256", "name": "max_eth_sold" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "exchange_addr" }], "constant": false, "payable": false, "type": "function", "gas": 53233 }, { "name": "tokenToExchangeTransferOutput", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_bought" }, { "type": "uint256", "name": "max_tokens_sold" }, { "type": "uint256", "name": "max_eth_sold" }, { "type": "uint256", "name": "deadline" }, { "type": "address", "name": "recipient" }, { "type": "address", "name": "exchange_addr" }], "constant": false, "payable": false, "type": "function", "gas": 53423 }, { "name": "getEthToTokenInputPrice", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "eth_sold" }], "constant": true, "payable": false, "type": "function", "gas": 5542 }, { "name": "getEthToTokenOutputPrice", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_bought" }], "constant": true, "payable": false, "type": "function", "gas": 6872 }, { "name": "getTokenToEthInputPrice", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "tokens_sold" }], "constant": true, "payable": false, "type": "function", "gas": 5637 }, { "name": "getTokenToEthOutputPrice", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "uint256", "name": "eth_bought" }], "constant": true, "payable": false, "type": "function", "gas": 6897 }, { "name": "tokenAddress", "outputs": [{ "type": "address", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1413 }, { "name": "factoryAddress", "outputs": [{ "type": "address", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1443 }, { "name": "balanceOf", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "address", "name": "_owner" }], "constant": true, "payable": false, "type": "function", "gas": 1645 }, { "name": "transfer", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "_to" }, { "type": "uint256", "name": "_value" }], "constant": false, "payable": false, "type": "function", "gas": 75034 }, { "name": "transferFrom", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "_from" }, { "type": "address", "name": "_to" }, { "type": "uint256", "name": "_value" }], "constant": false, "payable": false, "type": "function", "gas": 110907 }, { "name": "approve", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "_spender" }, { "type": "uint256", "name": "_value" }], "constant": false, "payable": false, "type": "function", "gas": 38769 }, { "name": "allowance", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [{ "type": "address", "name": "_owner" }, { "type": "address", "name": "_spender" }], "constant": true, "payable": false, "type": "function", "gas": 1925 }, { "name": "name", "outputs": [{ "type": "bytes32", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1623 }, { "name": "symbol", "outputs": [{ "type": "bytes32", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1653 }, { "name": "decimals", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1683 }, { "name": "totalSupply", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1713 }];
        // #endregion 
        this.priceMonitor = undefined;
        this.monitoringPrice = false;
        this.POLLING_INTERVAL = 3000; // 3 Seconds
        const abi = IUniswapV2Factory_json_1.default.abi;
        this.uniswapFactoryContract = new this.web3.eth.Contract(abi, this.UNISWAP_FACTORY_ADDRESS);
        // Check markets every n seconds
        // this.priceMonitor = setInterval(async () => { await this.monitorPrice() }, this.POLLING_INTERVAL)
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            const TETHER_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
            const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
            const getter = yield this.uniswapFactoryContract.methods.getPair(TETHER_ADDRESS, DAI_ADDRESS);
            console.log(getter);
            try {
                getter.call({})
                    .then(console.log)
                    .catch(console.error);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    checkPair(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { inputTokenSymbol, inputTokenAddress, outputTokenSymbol, outputTokenAddress, inputAmount } = args;
            console.log(this.uniswapFactoryContract.methods);
            const exchangeAddress = yield this.uniswapFactoryContract.methods.getExchange(outputTokenAddress).call();
            const exchangeContract = new this.web3.eth.Contract(this.UNISWAP_EXCHANGE_ABI, exchangeAddress);
            const uniswapResult = yield exchangeContract.methods.getEthToTokenInputPrice(inputAmount).call();
            // let kyberResult = await kyberRateContract.methods.getExpectedRate(inputTokenAddress, outputTokenAddress, inputAmount, true).call()
            console.table([{
                    'Input Token': inputTokenSymbol,
                    'Output Token': outputTokenSymbol,
                    'Input Amount': this.web3.utils.fromWei(inputAmount, 'ether'),
                    'Uniswap Return': this.web3.utils.fromWei(uniswapResult, 'ether'),
                    // 'Kyber Expected Rate': web3.utils.fromWei(kyberResult.expectedRate, 'Ether'),
                    // 'Kyber Min Return': web3.utils.fromWei(kyberResult.slippageRate, 'Ether'),
                    'Timestamp': moment_timezone_1.default().tz('America/Toronto').format(),
                }]);
        });
    }
    monitorPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.monitoringPrice) {
                return;
            }
            console.log("Checking prices...");
            this.monitoringPrice = true;
            try {
                // ADD YOUR CUSTOM TOKEN PAIRS HERE!!!
                yield this.checkPair.bind(this)({
                    inputTokenSymbol: 'ETH',
                    inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    outputTokenSymbol: 'MKR',
                    outputTokenAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
                    inputAmount: this.web3.utils.toWei('1', 'ether') // 1 ETH
                });
                yield this.checkPair({
                    inputTokenSymbol: 'ETH',
                    inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    outputTokenSymbol: 'DAI',
                    outputTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
                    inputAmount: this.web3.utils.toWei('1', 'ether')
                });
                yield this.checkPair({
                    inputTokenSymbol: 'ETH',
                    inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    outputTokenSymbol: 'KNC',
                    outputTokenAddress: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
                    inputAmount: this.web3.utils.toWei('1', 'ether')
                });
                yield this.checkPair({
                    inputTokenSymbol: 'ETH',
                    inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    outputTokenSymbol: 'LINK',
                    outputTokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
                    inputAmount: this.web3.utils.toWei('1', 'ether')
                });
            }
            catch (error) {
                console.error(error);
                this.monitoringPrice = false;
                clearInterval(this.priceMonitor);
                return;
            }
            this.monitoringPrice = false;
        });
    }
}
exports.default = PriceManager;
