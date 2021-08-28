import express, { Request, Response } from "express";
import { IController } from "../types";
import PriceManager from "../managers/PriceManager";


export default class PriceController implements IController {
  public router = express.Router();
  priceManager = new PriceManager();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get("/", this.getPrices);
    // this.router.get("/:id", this.getPrice);
    // this.router.post("/", this.createPrice);
    // this.router.put("/:id", this.updatePrice);
    // this.router.delete("/:id", this.deletePrice);
  }

  getPrices = async (req: Request, res: Response) => {
    const prices = await this.priceManager.test();
    res.status(200).json(prices);
  }
}