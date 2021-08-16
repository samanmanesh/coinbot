import { ReturnDocument } from "mongodb";
import JointCoins, {ICoins } from "../models/jointCoins"

export default class JointCoinsManager {
    constructor() {}

    public async createJointCoin(jointCoin: ICoins) {

      try {
        jointCoin = await JointCoins.save(jointCoin); 
      } catch (error) {
        console.error(error.message);
      }
    }

    public async getJointCoins() {
      try {
        return await JointCoins.find();
      } catch (error) {
        console.error(error.message);
      }
    }

    public async getJointCoin(coinSymbol: string) {
      try {
        return await JointCoins.findOne({coinSymbol: coinSymbol});
      } catch (error) {
        console.error(error.message);
      }
    }

    public async deleteJointCoin(coinSymbol: string) {

      try {
        await JointCoins.remove({coinSymbol: coinSymbol});
      } catch (error) {
        console.error(error.message);
      }
    }

    public async updateJointCoin(coinSymbol: string, newJointCoin: ICoins): Promise<ICoins | undefined> {
      
      const preJointCoin = await this.getJointCoin(coinSymbol);
      if (!preJointCoin) return undefined;
      const updatedJointCoin = { ...preJointCoin, newJointCoin };
   
      
      try {
        await JointCoins.updateOne({coinSymbol}, updatedJointCoin);e
      } catch (error) {
        console.error(error.message);
      }
    }

}