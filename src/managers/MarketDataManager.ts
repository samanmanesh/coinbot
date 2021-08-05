import MarketData, { IMarketData } from "../models/MarketData";
import axios, { AxiosRequestConfig } from "axios";
import { ICoinMarketCapCoin, ICoinData } from "../types";

export default class MarketDataManager {

  public async getMarketDataFromAPI(): Promise<IMarketData | undefined> {
    let marketData: IMarketData | undefined;
    const config: AxiosRequestConfig = {
      params: {
        start: 1,
        limit: 10,
        convert: "CAD",
      },
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
      },
    }
    try {
      const { data } = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        config
      );
      const coinsFromResponse: ICoinMarketCapCoin[] = data.data;
      const coins: ICoinData[] = coinsFromResponse.map(
        (c: ICoinMarketCapCoin) => ({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          total_supply: c.total_supply,
          last_updated: c.last_updated,
          quote: c.quote,
        })
      );
      marketData = {
        date_added: new Date(),
        coins,
      };
    } catch (error) {
      console.error(error.message);
    }
    return marketData;
  }

  public async getMarketData(): Promise<IMarketData | undefined> {
    const marketData = await MarketData.findOne({});
    return marketData;
  }

  public async updateMarketData(marketData: IMarketData) {
    try {
      await MarketData.update({}, marketData);
      return true;
    } catch (error) {
      return false;
    }
  }
}