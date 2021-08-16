import { DeleteResult, MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

class Model<T> {
  databaseName = "myFirstDatabase";
  collectionName: string = "";
  client: MongoClient;

  constructor(collection: string) {
    this.client = new MongoClient(process.env.DB_CONNECTION_URI ?? "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    this.connect();
    this.collectionName = collection;

  }

  async connect() {
    await this.client.connect();
    console.log("Connected to DataBase");
  }

  public async save(document: T) {
    await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .insertOne(document);
    return document;
  }

  public async find(filter?: any): Promise<T[] | undefined> {
    return await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .find(filter)
      .toArray();
  }

  public async findOne(filter?: any): Promise<T | undefined> {
    return (await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .findOne(filter)) as T | undefined;
  }

  public async remove(filter: any): Promise<DeleteResult> {
    return await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .deleteOne(filter);
  }

  public async updateOne(filter: any, document: T) {
    return await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .updateOne(filter, { $set: document });
  }

  public async addToArray(filter: any, arrayName: string, document: any) {
    return await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .updateOne(filter, { $addToSet: { [arrayName]: document } });
  }

  public async removeFromArray(filter: any, arrayName: string, document: any) {
    return await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .updateOne(filter, { $pull: { [arrayName]: { $in: [document] } } });
  }



  public async update(filter: any, document: T) {
    return await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .updateMany(filter, { $set: document });
  }

  public async removeAll() {
    return await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .deleteMany({});
  }

  public async saveMany(documents: T[]) {
    await this.client
      .db(this.databaseName)
      .collection(this.collectionName)
      .insertMany(documents);
  }
}

function model<T>(collection: string): Model<T> {
  return new Model<T>(collection);
}

export default model;
