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



  }
}

