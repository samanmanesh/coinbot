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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class Model {
    constructor(collection) {
        var _a;
        this.databaseName = "myFirstDatabase";
        this.collectionName = "";
        this.client = new mongodb_1.MongoClient((_a = process.env.DB_CONNECTION_URI) !== null && _a !== void 0 ? _a : "", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.connect();
        this.collectionName = collection;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            console.log("Connected to DataBase");
        });
    }
    save(document) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .insertOne(document);
            return document;
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .find(filter)
                .toArray();
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .findOne(filter));
        });
    }
    remove(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .deleteOne(filter);
        });
    }
    updateOne(filter, document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .updateOne(filter, { $set: document });
        });
    }
    // public async addToArray(filter: any, document: any) {
    //   return await this.client
    //   .db(this.databaseName)
    //   .collection(this.collectionName)
    //   .update(filter, { $addToSet:  document });
    // }
    addToArray(filter, document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .updateOne(filter, { $set: document });
        });
    }
    update(filter, document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .updateMany(filter, { $set: document });
        });
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .deleteMany({});
        });
    }
    saveMany(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client
                .db(this.databaseName)
                .collection(this.collectionName)
                .insertMany(documents);
        });
    }
}
function model(collection) {
    return new Model(collection);
}
exports.default = model;
