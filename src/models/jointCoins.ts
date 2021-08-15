import model from '../database/Model'

export interface ICoins{
  coinName: string;
  accounts: string[];
}

const JointCoins = model<ICoins>("common_coins_accounts");

export default JointCoins;