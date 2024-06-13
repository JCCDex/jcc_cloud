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
  IFetchIssuerNftsOptions,
  IFetchIssuerNftsResponse,
  IFetchNftsByIdOrNameOptions,
  IFetchNftsByIdOrNameResponse,
  IFetchNftTransfersOptions,
  IFetchNftTransfersResponse,
  IFetchNftConfigsRequest
} from "./types";

export default class JCCDexExplorer {
  readonly timeOffset = 946684800000;

  public orderType = OrderType;

  public tradeType = TradeType;

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

  public async fetchBlockTransactions(
    options: IFetchBlockTransactionsOptions
  ): Promise<IFetchBlockTransactionsResponse> {
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

    const transactions = (data.list as IBlockTransaction[]) || [];

    transactions.forEach((transaction) => {
      transaction.hash = transaction._id;
      transaction.blockHash = transaction.upperHash;
      delete transaction._id;
      delete transaction.upperHash;
      transaction.time = transaction.time * 1000 + this.timeOffset;
    });
    return { code, msg, data: { transactions } };
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
    const blocks = (data.list as IBlockInfo[]) || [];

    blocks.forEach((block) => {
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
    const blocks = (data.list as IBlockInfo[]) || [];

    blocks.forEach((block) => {
      block.block = block._id;
      delete block._id;
      block.time = block.time * 1000 + this.timeOffset;
      block.past = block.past * 1000;
    });
    return { code, msg, data: { blocks } };
  }

  public async fetchIssuedNfts(options: IFetchIssuerNftsOptions): Promise<IFetchIssuerNftsResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/config/all" + options.uuid,
      params: {
        i: options.issuer,
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const nfts = (data.list as Record<string, unknown>[]) || [];
    return {
      code,
      msg,
      data: {
        nfts: nfts.map((nft) => {
          return {
            fundCode: nft.FundCode as string,
            issuer: nft.Issuer as string,
            flags: nft.Flags as number,
            fundCodeName: nft.FundCodeName as string,
            ledgerIndex: nft.LedgerIndex as string,
            tokenIssued: nft.TokenIssued as string,
            tokenSize: nft.TokenSize as string,
            hash: nft.hash as string,
            issuerAccountId: nft.issuer_accountid as string,
            issuerTime: (nft.issuer_time as number) * 1000 + this.timeOffset
          };
        })
      }
    };
  }

  public async fetchNftsByIdOrName(options: IFetchNftsByIdOrNameOptions): Promise<IFetchNftsByIdOrNameResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/all/" + options.uuid,
      params: {
        k: options.tokenId,
        n: options.tokenName
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    return {
      code,
      msg,
      data: {
        tokenIds: data.token_id as string[],
        tokenNames: (data.token_name as string[]).map((t) => {
          const [name, holder] = t.split("_");
          return { name, holder };
        })
      }
    };
  }

  public async fetchNftTransfers(options: IFetchNftTransfersOptions): Promise<IFetchNftTransfersResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/transfer/" + options.uuid,
      params: {
        w: options.address,
        k: options.tokenId,
        p: options.page || 0,
        s: options.size || this.pageSize.TWENTY,
        t: options.type,
        b: options.beginTime,
        e: options.endTime,
        aw: options.counterparty
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    return {
      code,
      msg,
      data: {
        count: data.count as number,
        transfers: (data.list as Record<string, unknown>[]).map((t) => {
          return {
            wallet: t.wallet as string,
            type: t.type as string,
            time: (t.time as number) * 1000 + this.timeOffset,
            hash: t.hash as string,
            block: t.block as number,
            fee: (t.fee as string) + "",
            success: t.success as string,
            seq: t.seq as number,
            offer: t.offer as number,
            index: t.index as number,
            tokenId: t.TokenID as string,
            flags: t.Flags as number,
            fundCode: t.FundCode as string,
            fundCodeName: t.FundCodeName as string,
            issuer: t.Issuer as string,
            lowNode: t.LowNode as string,
            tokenInfos: t.TokenInfos as unknown[],
            tokenOwner: t.TokenOwner as string,
            tokenSender: t.TokenSender as string
          };
        })
      }
    };
  }

  public async fetchNftConfigs(options: IFetchNftConfigsRequest): Promise<IFetchIssuerNftsResponse> {
    const res: IResponse = await fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/config/" + options.uuid,
      params: {
        n: options.fundCodeName,
        w: options.issuer
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const nfts = (data.list as Record<string, unknown>[]) || [];
    return {
      code,
      msg,
      data: {
        nfts: nfts.map((nft) => {
          return {
            fundCode: nft.FundCode as string,
            issuer: nft.Issuer as string,
            flags: nft.Flags as number,
            fundCodeName: nft.FundCodeName as string,
            ledgerIndex: nft.LedgerIndex as string,
            tokenIssued: nft.TokenIssued as string,
            tokenSize: nft.TokenSize as string,
            hash: nft.hash as string,
            issuerAccountId: nft.issuer_accountid as string,
            issuerTime: (nft.issuer_time as number) * 1000 + this.timeOffset
          };
        })
      }
    };
  }
}
