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


}