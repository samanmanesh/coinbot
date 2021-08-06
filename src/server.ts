import AccountController from "./routes/account.controller";
import { IRoute } from "./types";
import App from "./app/index";
import CoinMarketController from "./routes/marketData.controller";
import SellAnalyst from "./routes/sell.analyzer";

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
    path: "/sell-analyzer",
    controller: new SellAnalyst(),
  },
];

const app = new App(routes);
app.listen(3000);
