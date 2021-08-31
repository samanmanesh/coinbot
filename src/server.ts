import AccountController from "./routes/account.controller";
import { IRoute } from "./types";
import App from "./app/index";
import CoinMarketController from "./routes/marketData.controller";
import Analyzer from "./routes/analyzer";
import JointCoinsController from "./routes/jointCoins.controller";
import PriceController from "./routes/price.controller";

const routes: IRoute[] = [
  {
    path: "/accounts",
    controller: new AccountController(),
  },
  {
    path: "/market-cap",
    controller: new CoinMarketController(),
  },
  {
    path: "/analyzer",
    controller: new Analyzer(),
  },
  {
    path: "/joint-coins",
    controller: new JointCoinsController(),
  },
  {
    path: "/prices",
    controller: new PriceController()
  }
];

const app = new App(routes);
app.listen(3000);
