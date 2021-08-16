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


}