import * as dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer";
export default class PriceManager {
  // constructor() {}

  // async getMarketPrice () {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.goto('https://www.google.com/');
  //   await page.screenshot({ path: 'example.png' });

  //   await browser.close();

  // }


  browser = null;
  page1 = null;
  page2 = null;
  intervalRate = 500;
  url = '';
  selector = '';

  // constructor(url: string, selector: string) {
  //   this.url = url;
  //   this.selector = selector;
  // }

  async interval() {

    // await this.init().then(() => setInterval(() => this.getData(), this.intervalRate));

  }

  async init(url: string, selector: string) {
    //@ts-ignore
    this.browser = await puppeteer.launch();
    //@ts-ignore
    this.page = await this.browser.newPage();
    //@ts-ignore
    await this.page.goto(url);
    //@ts-ignore
    await this.page.waitForSelector(selector);
  }

  // async getData() {
  //   //@ts-ignore
  //   let data = await this.page.$eval(this.selector, node => {
  //     return node.innerText
  //   });
  //   console.log(data);
  //   console.log('------');
  //   return data;
  // }



  async getData( selector: string) {
  
    //@ts-ignore
    let data = await this.page.$eval(selector, node => {
      return node.innerText
    });
    console.log(data);
    console.log('------');
    return data;

  }


  async BTCInit (url: string, selector: string){
    // let page = undefined;

    //@ts-ignore
    this.browser = await puppeteer.launch();
    //@ts-ignore
    this.page1 = await this.browser.newPage();
    //@ts-ignore
    await this.page1.goto(url);
    //@ts-ignore
    await this.page1.waitForSelector(selector);
  }

  async BTCGetData( selector: string){
    //@ts-ignore
    let data = await this.page1.$eval(selector, node => {
      return node.innerText
    });
    console.log("BTC Price")
    console.log(data);
    console.log('------');
    return data;
  }

  // async BTCInitAndGetData(url: string, selector: string){
  //   //@ts-ignore
  //   this.browser = await puppeteer.launch();
  //   //@ts-ignore
  //   this.page = await this.browser.newPage();
  //   //@ts-ignore
  //   await this.page.goto(url);
  //   //@ts-ignore
  //   await this.page.waitForSelector(selector);

  //   // await puppeteer.launch().then(browser => { browser.newPage().then(page => {
  //   //   page.goto(url).then(() => { page.waitForSelector(selector)})}) 
  //   // });

  //   //@ts-ignore
  //   let data = await this.page.$eval(selector, node => {
  //     return node.innerText
  //   });
  //   console.log("BTC Price")
  //   console.log(data);
  //   console.log('------');
  //   return data;
    
  // }



  async ADAInit (url: string, selector: string){
    // let page = undefined;
    //@ts-ignore
    this.browser = await puppeteer.launch();
    //@ts-ignore
    this.page2 = await this.browser.newPage();
    //@ts-ignore
    await this.page2.goto(url);
    //@ts-ignore
    await this.page2.waitForSelector(selector);
  }


  async ADAGetData( selector: string){
    //@ts-ignore
    let data = await this.page2.$eval(selector, node => {
      return node.innerText
    });
    console.log("ADA Price")
    console.log(data);
    console.log('------');
    return data;
  }


























}
// const BINANCE_URL = 'https://www.binance.com/en/trade/BTC_USDT?layout=pro';
// const SELECTOR = '.chart-title-indicator-container';
// const scraper = new Scraper(BINANCE_URL, SELECTOR);
