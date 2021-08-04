import express, { Request, Response } from "express";
import { IController} from "../types";

enum SellAnalyzerPath {
  Base = "/",
}
export default class SellAnalyzer {
    public router = express.Router();
    

    constructor() { 
      this.setupRoutes();
       
    }

    setupRoutes() { 
    
      this.router.get(SellAnalyzerPath.Base, this.analyze);
    }

    public async analyze(req: Request, res: Response) {
      throw new Error("Not implemented.");

      //Todo first gets the data related to accounts from data base
      
      


      //Todo then gets the data for preferred_coins for each account from the data base


      

  }
}

