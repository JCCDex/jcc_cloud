import fetch from "./fetch";
import { IFetchBalancesOptions, IFetchBalancesResponse, IResponse } from "./types";

export default class JCCDexExplorer {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private isSuccess(res): boolean {
    return res?.code === "0";
  }

  public async fetchBalances(options: IFetchBalancesOptions): Promise<IFetchBalancesResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      timeout: options.timeout,
      url: "/wallet/balance/" + options.uuid,
      params: {
        w: options.address
      }
    });
    if (!this.isSuccess(res)) {
      throw new Error(res.msg);
    }
    const { code, msg, data } = res;

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
}
