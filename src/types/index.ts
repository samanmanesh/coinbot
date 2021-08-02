import express, { Router } from "express";

export interface IController {
  router: Router;
}

export interface IRoute {
  path: string;
  controller: IController;
}

export interface IQuote {
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  last_updated: Date;
}

export interface ICoinMarketCapCoin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: Date;
  tags: string[];
  max_supply: any;
  circulating_supply: number;
  total_supply: number;
  platform: null;
  cmc_rank: number;
  last_updated: Date;
  quote: IQuote;
}

export interface ICoin {
  id: number;
  name: string;
  symbol: string;
  total_supply: number;
  last_updated: Date;
  quote: IQuote;
}

/** 
       * {
      id: 1027,
      name: string,
      symbol: 'ETH',
      slug: string,
      num_market_pairs: 5629,
      date_added: '2015-08-07T00:00:00.000Z',
      tags: [Array],
      max_supply: null,
      circulating_supply: 116943864.5615,
      total_supply: 116943864.5615,
      platform: null,
      cmc_rank: 2,
      last_updated: '2021-08-02T20:07:06.000Z',
      quote: [Object]
    }
       */
