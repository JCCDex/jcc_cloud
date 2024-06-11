import { CloudError } from "./error";
import fetch from "./fetch";
import { IResponse, IOrderType, ITradeType, IPageSize,
  IFetchBalancesOptions, IFetchBalancesResponse,
  IFetchOffersOptions, IFetchOffersResponse,
  IFetchHistoryOrdersOptions, IFetchHistoryOrdersResponse,
  IFetchIssuedTokensOptions, IFetchIssuedTokensResponse,
  IFetchHistoryFeesOptions, IFetchHistoryFeesResponse

} from "./types";

export default class JCCDexExplorer {
  readonly timeOffset = 946684800000;

  public orderType = IOrderType;

  public tradeType = ITradeType;

  public pageSize = IPageSize;

  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public set timeout(v: number) {
    fetch.defaults.timeout = v;
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private isSuccess(code): boolean {
    return code === "0";
  }

  public async fetchBalances(options: IFetchBalancesOptions): Promise<IFetchBalancesResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/balance/" + options.uuid,
      params: {
        w: options.address
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    delete data?._id;
    delete data?.feeflag;

    const balances = [];

    for (const key in data) {
      const d = data[key];
      const [currency, issuer] = key.split("_");
      balances.push(Object.assign(d, { currency, issuer: issuer || "" }));
    }

    return { code, msg, data: { balances } };
  }

  public async fetchOffers(options: IFetchOffersOptions): Promise<IFetchOffersResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/offer/" + options.uuid,
      params: {
        w: options.address,
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY,
        c: options.coinPair || "",
        bs: options.buyOrSell || this.tradeType.ALL
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const offers = (data.list as any[] || []);
    offers.forEach(offer => {
      offer.time = offer.time * 1000 + this.timeOffset;
    });
    return { code, msg, data: { offers } };
  }

  public async fetchHistoryOrders(options: IFetchHistoryOrdersOptions): Promise<IFetchHistoryOrdersResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/trans/" + options.uuid,
      params: {
        w: options.address,
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY,
        b: options.beginTime || "",
        e: options.endTime || "",
        t: options.type || this.orderType.ALL,
        c: options.coinPair || "",
        bs: options.buyOrSell || this.tradeType.ALL
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const historOrders = (data.list as any[] || []);
    historOrders.forEach(order => {
      order.time = order.time * 1000 + this.timeOffset;
    });
    return { code, msg, data: { historOrders } };
  }

  public async fetchIssuedTokens(options: IFetchIssuedTokensOptions): Promise<IFetchIssuedTokensResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/fingate_tokenlist/" + options.uuid,
      params: {
        w: options.address
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const tokens = (data[options.address] as any[] || []);
    return { code, msg, data: { tokens } };
  }

  public async fetchHistoryFees(options: IFetchHistoryFeesOptions): Promise<IFetchHistoryFeesResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/trans/fee/" + options.uuid,
      params: {
        w: options.address,
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY,
        b: options.beginTime || "",
        e: options.endTime || "",
        c: options.tokenAndIssuer || "",
        t: "Fee",
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const fees = (data.list as any[] || []);

    fees.forEach(fee => {
      const [currency, issuer] = fee.currency.split("_");
      fee.currency = currency;
      fee.issuer = issuer || "";
      fee.time = fee.time * 1000 + this.timeOffset;
    });
    return { code, msg, data: { fees } };
  }

}


