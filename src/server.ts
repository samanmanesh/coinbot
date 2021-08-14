import AccountController from "./routes/account.controller";
import { IRoute } from "./types";
import App from "./app/index";
import CoinMarketController from "./routes/marketData.controller";
import Analyzer from "./routes/analyzer";

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
    path: "/analyz  er",
    controller: new Analyzer(),
  },
];

const app = new App(routes);
app.listen(3000);
