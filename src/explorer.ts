import { CloudError } from "./error";
import fetch from "./fetch";
import {
  IResponse,
  OrderType,
  TradeType,
  PageSize,
  IFetchBalancesOptions,
  IFetchBalancesResponse,
  IFetchOffersOptions,
  IFetchOffersResponse,
  IFetchHistoryOrdersOptions,
  IFetchHistoryOrdersResponse,
  IFetchIssuedTokensOptions,
  IFetchIssuedTokensResponse,
  IFetchHistoryFeesOptions,
  IFetchHistoryFeesResponse,
  IIssueToken,
  IHistoryOrder,
  IOffer,
  IHistoryFee,
  IFetchBlockTransactionsOptions,
  IFetchBlockTransactionsResponse,
  IBlockTransaction,
  IFetchLatestSixBlocksOptions,
  IFetchLatestSixBlocksResponse,
  IFetchAllBlocksOptions, 
  IFetchAllBlocksResponse,
  IBlockInfo,
  IFetchLatestSixHashOptions,
  IFetchLatestSixHashResponse,
  IHashInfo,
  IFetchAllHashOptions,
  IFetchAllHashResponse,
  TransactionType,
  IFetchHashDetailOptions,
  IFetchBlockHashDetailResponse,
  IFetchTransHashDetailResponse,
  IHashDetailInfo,
  IBlockHashDetailInfo,
  IFetchBlockHashTransactionsOptions,
  IFetchBlockHashTransactionsResponse
} from "./types";

export default class JCCDexExplorer {
  readonly timeOffset = 946684800000;

  public orderType = OrderType;

  public tradeType = TradeType;

  public transactionType = TransactionType;

  public pageSize = PageSize;

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

    const offers = (data.list as IOffer[]) || [];
    offers.forEach((offer) => {
      offer.time = offer.time * 1000 + this.timeOffset;
      offer.past = offer.past * 1000;
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

    const historOrders = (data.list as IHistoryOrder[]) || [];
    historOrders.forEach((order) => {
      order.time = order.time * 1000 + this.timeOffset;
      order.past = order.past * 1000;
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

    const tokens = (data[options.address] as IIssueToken[]) || [];
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
        t: "Fee"
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const fees = (data.list as IHistoryFee[]) || [];

    fees.forEach((fee) => {
      const [currency, issuer] = fee.currency.split("_");
      fee.currency = currency;
      fee.issuer = issuer || "";
      fee.time = fee.time * 1000 + this.timeOffset;
    });
    return { code, msg, data: { fees } };
  }

  public async fetchBlockTransactions(options: IFetchBlockTransactionsOptions): Promise<IFetchBlockTransactionsResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/block/trans/" + options.uuid,
      params: {
        b: options.blockNumber,
        p: options.page || "",
        s: options.size || this.pageSize.TWENTY
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const transactions = (data.list as IBlockTransaction[] || []);

    transactions.forEach(transaction => {
      transaction.hash = transaction._id;
      transaction.blockHash = transaction.upperHash;
      delete transaction._id;
      delete transaction.upperHash;
      transaction.time = transaction.time * 1000 + this.timeOffset;
    });
    return { code, msg, data: { transactions, total: data.count as number } };
  }

  public async fetchLatestSixBlocks(options: IFetchLatestSixBlocksOptions): Promise<IFetchLatestSixBlocksResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/block/new/" + options.uuid,
      params: {}
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const blocks = (data.list as IBlockInfo[] || []);

    blocks.forEach(block => {
      block.block = block._id;
      delete block._id;
      block.time = block.time * 1000 + this.timeOffset;
      block.past = block.past * 1000;
    });
    return { code, msg, data: { blocks } };
  }

  public async fetchAllBlocks(options: IFetchAllBlocksOptions): Promise<IFetchAllBlocksResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/block/all/" + options.uuid,
      params: {
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const blocks = (data.list as IBlockInfo[] || []);

    blocks.forEach(block => {
      block.block = block._id;
      delete block._id;
      block.time = block.time * 1000 + this.timeOffset;
      block.past = block.past * 1000;
    });
    return { code, msg, data: { blocks } };
  }

  public async fetchLatestSixHash(options: IFetchLatestSixHashOptions): Promise<IFetchLatestSixHashResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/trans/new/" + options.uuid,
      params: {}
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const hashInfos = (data.list as IHashInfo[] || []);
  
    hashInfos.forEach(info => {
      info.hash = info._id;
      delete info._id;
      info.time = info.time * 1000 + this.timeOffset;
      info.past = info.past * 1000;
    });
    return { code, msg, data: { hashInfos } };
  }

  public async fetchAllHash(options: IFetchAllHashOptions): Promise<IFetchAllHashResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/trans/all/" + options.uuid,
      params: {
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY,
        b: options.beginTime || "",
        e: options.endTime || "",
        t: options.type || this.transactionType.ALL,
        bs: options.buyOrSell || this.tradeType.ALL,
        c: options.coinPair || "",
        f: options.matchFlag || ""
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const hashInfos = (data.list as IHashInfo[] || []);
    const total = (data.count as number);
  
    hashInfos.forEach(info => {
      info.hash = info._id;
      info.success = info.succ;
      delete info._id;
      delete info.succ;
      info.time = info.time * 1000 + this.timeOffset;
      info.past = info.past * 1000;
    });
    return { code, msg, data: { hashInfos, total } };
  }

  public async fetchHashDetailInfo(options: IFetchHashDetailOptions): Promise<IFetchBlockHashDetailResponse | IFetchTransHashDetailResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/hash/detail/" + options.uuid,
      params: {
        h: options.hash
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    /** block hash resault */
    if (data.info && data.list && Array.isArray(data.list)) {
      const info = data.info as Record<string, unknown>;
      return { code, msg, data: {
          hashType: 1,
          blockInfo: {
            blockHash: info._id as string,
            block: info.block as number,
            time: info.time as number * 1000 + this.timeOffset,
            past: info.past as number * 1000,
            transNum: info.transNum as number,
            parentHash: info.upperHash as string,
            totalCoins: info.totalCoins as string
          },
          blockDetails: (data.list as IBlockHashDetailInfo[]).map((tInfo)=>{
            tInfo.hash = tInfo._id;
            tInfo.success = tInfo.succ;
            return tInfo;
          }),
          total: data.count as number
        }
      };
    }
    /** transaction hash resault */
    const hashDetails = {} as IHashDetailInfo;
  
    for (const key in data) {
      const v = data[key];
      switch (key) {
        case "hashType":
          continue;
        case "_id":
          hashDetails.hash = v as string;
          break;
        case "upperHash":
          hashDetails.blockHash = v as string;
          break;
        case "succ":
          hashDetails.success = v as string;
          break;
        case 'time':
          hashDetails.time = v as number * 1000 + this.timeOffset;
          break;
        case 'past':
          hashDetails.past = v as number * 1000;
          break;
        default:
          hashDetails[key] = v;
          break;
      }
    }
    return { code, msg, data: {
        hashType: 2,
        hashDetails
      } 
    };
  }

  public async fetchBlockTransactionsByHash(options: IFetchBlockHashTransactionsOptions): Promise<IFetchBlockHashTransactionsResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/hash/trans/" + options.uuid,
      params: {
        h: options.blockHash,
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY,
        n: 1 // this parameter seems to be bug, must be greater than 0
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const transactions = (data.list as IBlockHashDetailInfo[] || []);
    transactions.forEach(trans => {
      trans.hash = trans._id;
      trans.success = trans.succ;
      delete trans._id;
      delete trans.succ;
      delete trans.hashType;
    });
    return { code, msg, data: { transactions } };
  }
}
