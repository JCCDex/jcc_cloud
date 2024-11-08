import { CloudError } from "./error";
import { defaultFetch } from "./fetch";
import {
  IResponse,
  OrderType,
  TradeType,
  PageSize,
  IFetchBalancesOptions,
  IFetchBalancesResponse,
  IFetchOffersOptions,
  IFetchOffersResponse,
  IFetchOfferDetailOptions,
  IFetchOfferDetailResponse,
  IOfferHistoryInfo,
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
  IFetchNftsNameOptions,
  IFetchNftsNameResponse,
  IFetchAllNftsNameResponse,
  IFetchNftTokenIdOptions,
  IFetchNftTokenIdResponse,
  IFetchNftTransfersOptions,
  IFetchNftTransfersResponse,
  IFetchNftConfigsRequest,
  IFetchNftTokenInfoRequest,
  IFetchNftTokenInfoResponse,
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
  IFetchBlockHashTransactionsResponse,
  IFetchNftConfigResponse,
  IFetchTokensOptions,
  IFetchTokensResponse,
  ITokenInfo,
  IFetchTokensCirculationOptions,
  IFetchTokensCirculationResponse,
  ITokenCirculationInfo,
  IFetchTokensListOptions,
  IFetchTokensListResponse,
  IFetchAllTokensListResponse,
  IFetchTokenTradeStatisticOptions,
  IFetchTokenTradeStatisticResponse,
  ITradeStatistic,
  IFetchUserStatisticOptions,
  IFetchUserStatisticResponse,
  IUserStatistic,
  IFetchTokenBalanceStatisticOptions,
  IFetchTokenBalanceStatisticResponse,
  IFetchLatestTransactionsOptions,
  IFetchLatestTransactionsResponse,
  ITransactionRecord,
} from "./types";
import {
  isDef,
  isValidNftTransactionType,
  isValidPage,
  isValidSize,
  isValidStatus,
  isValidTransactionType,
  isValidTradeType,
  isValidOrderType,
  convertTime,
  isValidString,
  isValidCount,
  isValidOfferSearchType
} from "./util";
const assert = require("assert");

export default class JCCDexExplorer {
  public fetch;

  public orderType = OrderType;

  public tradeType = TradeType;

  public transactionType = TransactionType;

  public pageSize = PageSize;

  private baseUrl: string;

  constructor(baseUrl: string, customFetch?: unknown) {
    this.baseUrl = baseUrl;
    this.fetch = customFetch || defaultFetch;
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private isSuccess(code): boolean {
    return code === "0";
  }

  public async fetchBalances(options: IFetchBalancesOptions): Promise<IFetchBalancesResponse> {
    const address = options.address;
    assert(isValidString(address), "Address is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/balance/" + options.uuid,
      params: {
        w: address
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
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const buyOrSell = options.buyOrSell || this.tradeType.ALL;
    const address = options.address;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isValidTradeType(buyOrSell), "buyOrSell is invalid");
    assert(isValidString(address), "Address is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      // 后续等待新的分析程序数据完全后切换到新接口，释放wallet分析程序的负担 "/explorer/v1/offer/list/" + options.uuid
      url: "/wallet/offer/" + options.uuid,
      params: {
        w: address,
        p: page,
        s: size,
        c: options.coinPair || "",
        bs: buyOrSell
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const offers = (data.list as IOffer[]) || [];
    const count = data.count as number || 0;
    offers.forEach((offer) => {
      offer.time = convertTime(offer.time);
      offer.past = offer.past * 1000;
    });
    return { code, msg, data: { offers, count } };
  }

  public async fetchOffersDetail(options: IFetchOfferDetailOptions): Promise<IFetchOfferDetailResponse> {
    const searchType = options.searchType || 0;
    const seq = options.seq;
    const address = options.address;
    assert(isValidOfferSearchType(searchType), "searchType is invalid");
    assert(isValidCount(seq), "Seq is invalid");
    assert(isValidString(address), "Address is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/offer/state/" + options.uuid,
      params: {
        w: address,
        seq,
        trans: searchType
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    let offerStatus = null, offerHistory = null;
    if (searchType === 0 && data.wallet) {
      offerStatus = Object.assign(data, {});
    } else if (searchType === 1) {
      offerHistory = Array.isArray(data) ? data : [];
    } else if (searchType === 2 && data.state && data.trans) {
      offerStatus = data.state ? Object.assign(data.state, {}) : {};
      offerHistory = (data.trans && Array.isArray(data.trans)) ? data.trans : [];
    }

    if (offerStatus && offerStatus.wallet) {
      offerStatus.updatedTime = convertTime(offerStatus.updatedTime);
      offerStatus.createdTime = convertTime(offerStatus.createdTime);
    }
    if (offerHistory) {
      offerHistory.forEach((offer: IOfferHistoryInfo) => {
        offer.time = convertTime(offer.time);
      });
    }
    return { code, msg, data: { offerStatus, offerHistory } };
  }

  public async fetchHistoryOrders(options: IFetchHistoryOrdersOptions): Promise<IFetchHistoryOrdersResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const buyOrSell = options.buyOrSell || this.tradeType.ALL;
    const type = options.type || "";
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isValidTradeType(buyOrSell), "buyOrSell is invalid");
    assert(isValidOrderType(type), "type is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/trans/" + options.uuid,
      params: {
        w: options.address,
        p: page,
        s: size,
        b: options.beginTime || "",
        e: options.endTime || "",
        t: type,
        c: options.coinPair || "",
        bs: buyOrSell
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const historOrders = (data.list as IHistoryOrder[]) || [];
    historOrders.forEach((order) => {
      order.time = convertTime(order.time);
      order.past = order.past * 1000;
    });
    return { code, msg, data: { historOrders } };
  }

  public async fetchIssuedTokens(options: IFetchIssuedTokensOptions): Promise<IFetchIssuedTokensResponse> {
    const res: IResponse = await this.fetch({
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
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const address = options.address;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isValidString(address), "Address is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/wallet/trans/fee/" + options.uuid,
      params: {
        w: address,
        p: page,
        s: size,
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
      fee.time = convertTime(fee.time);
    });
    return { code, msg, data: { fees } };
  }

  public async fetchBlockTransactions(
    options: IFetchBlockTransactionsOptions
  ): Promise<IFetchBlockTransactionsResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const block = options.blockNumber;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(typeof block === "number" && block > 0, "Block number is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/block/trans/" + options.uuid,
      params: {
        b: block,
        p: page,
        s: size
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
      transaction.time = convertTime(transaction.time);
    });
    return { code, msg, data: { transactions, count: data.count as number } };
  }

  public async fetchLatestSixBlocks(options: IFetchLatestSixBlocksOptions): Promise<IFetchLatestSixBlocksResponse> {
    const res: IResponse = await this.fetch({
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
      block.time = convertTime(block.time);
      block.past = block.past * 1000;
    });
    return { code, msg, data: { blocks } };
  }

  public async fetchAllBlocks(options: IFetchAllBlocksOptions): Promise<IFetchAllBlocksResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/block/all/" + options.uuid,
      params: {
        p: page,
        s: size
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
      block.time = convertTime(block.time);
      block.past = block.past * 1000;
    });
    return { code, msg, data: { blocks } };
  }

  public async fetchIssuedNfts(options: IFetchIssuerNftsOptions): Promise<IFetchIssuerNftsResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/config/all/" + options.uuid,
      params: {
        i: options.issuer,
        p: page,
        s: size
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
            count: nft.count as number,
            destroy: nft.destroy as number,
            issueCount: nft.issueCount as number,
            issueDate: nft.issueDate as number,
            totalCount: nft.totalCount as number
          };
        }),
        count: data.count as number // total count of nft
      }
    };
  }

  public async fetchNftsName(
    options: IFetchNftsNameOptions
  ): Promise<IFetchNftsNameResponse | IFetchAllNftsNameResponse> {
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/all/" + options.uuid,
      params: {
        n: options.tokenName || ""
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    let tokenNames = [];
    if (options.tokenName) {
      tokenNames = (data.token_name as string[]).map((t) => {
        const [name, issuer] = t.split("_");
        return { name, issuer };
      });
    } else {
      tokenNames = Object.values(data.token_name).map((t) => {
        let firstLetter = "";
        let list = [];
        for (const key in t) {
          firstLetter = key;
          list = (t[key] as Array<string>).map((nft) => {
            const [name, issuer] = nft.split("_");
            return { name, issuer };
          });
        }
        return { firstLetter, list };
      });
    }

    return { code, msg, data: { tokenNames } };
  }

  public async fetchNftTokenId(options: IFetchNftTokenIdOptions): Promise<IFetchNftTokenIdResponse> {
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/all/" + options.uuid,
      params: {
        k: options.tokenId || ""
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
        tokenIds: data.token_id as string[]
      }
    };
  }

  public async fetchNftTransfers(options: IFetchNftTransfersOptions): Promise<IFetchNftTransfersResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const { tokenId, address, type } = options;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isDef(tokenId) || isDef(address), 'At least one parameter is required in "tokenId, address"');
    assert(isValidNftTransactionType(type), 'The value of "type" is invalid');

    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/transfer/" + options.uuid,
      params: {
        w: address,
        k: tokenId,
        p: page,
        s: size,
        t: type || "",
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
            time: convertTime(t.time as number),
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

  public async fetchNftConfigs(options: IFetchNftConfigsRequest): Promise<IFetchNftConfigResponse> {
    const { issuer, fundCodeName, uuid } = options;
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/config/" + uuid,
      params: {
        n: fundCodeName,
        w: issuer
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
            issuerTime: convertTime(nft.issuer_time as number)
          };
        })
      }
    };
  }

  public async fetchNftTokenInfo(options: IFetchNftTokenInfoRequest): Promise<IFetchNftTokenInfoResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const { tokenId, address, issuer, fundCodeName, valid } = options;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(
      isDef(tokenId) || isDef(address) || isDef(issuer) || isDef(fundCodeName),
      'At least one parameter is required in "tokenId, address, issuer, fundCodeName"'
    );
    assert(isValidStatus(valid), 'The value of "valid" is invalid');
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/explorer/v1/nft/tokeninfo/" + options.uuid,
      params: {
        k: tokenId,
        w: address,
        p: page,
        s: size,
        i: issuer,
        n: fundCodeName,
        valid: options.valid
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
        nfts: (data.list as Record<string, unknown>[]).map((t) => {
          return {
            tokenId: t.TokenID as string,
            type: t.type as string,
            time: convertTime(t.time as number),
            hash: t.hash as string,
            block: t.block as number,
            index: t.index as number,
            flags: t.Flags as number,
            fundCode: t.FundCode as string,
            fundCodeName: t.FundCodeName as string,
            issuer: t.Issuer as string,
            lowNode: t.LowNode as string,
            tokenInfos: t.TokenInfos as unknown[],
            tokenOwner: t.TokenOwner as string,
            tokenSender: t.TokenSender as string,
            ledgerIndex: t.LedgerIndex as string,
            inservice: t.inservice as number,
            issuerTime: convertTime(t.issuer_time as number)
          };
        })
      }
    };
  }

  public async fetchLatestSixHash(options: IFetchLatestSixHashOptions): Promise<IFetchLatestSixHashResponse> {
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/trans/new/" + options.uuid,
      params: {}
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const hashInfos = (data.list as IHashInfo[]) || [];

    hashInfos.forEach((info) => {
      info.hash = info._id;
      delete info._id;
      info.time = convertTime(info.time);
      info.past = info.past * 1000;
    });
    return { code, msg, data: { hashInfos } };
  }

  public async fetchAllHash(options: IFetchAllHashOptions): Promise<IFetchAllHashResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const type = options.type || "";
    const tradeType = options.buyOrSell || this.tradeType.ALL;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isValidTransactionType(type), "Type is invalid");
    assert(isValidTradeType(tradeType), "buyOrSell is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/trans/all/" + options.uuid,
      params: {
        p: page,
        s: size,
        b: options.beginTime || "",
        e: options.endTime || "",
        t: type,
        bs: tradeType,
        c: options.coinPair || "",
        f: options.matchFlag || ""
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const hashInfos = (data.list as IHashInfo[]) || [];
    const count = data.count as number;

    hashInfos.forEach((info) => {
      info.hash = info._id;
      info.success = info.succ;
      delete info._id;
      delete info.succ;
      info.time = convertTime(info.time);
      info.past = info.past * 1000;
    });
    return { code, msg, data: { hashInfos, count } };
  }

  public async fetchHashDetailInfo(
    options: IFetchHashDetailOptions
  ): Promise<IFetchBlockHashDetailResponse | IFetchTransHashDetailResponse> {
    const hash = options.hash;
    assert(isValidString(hash), "Hash is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/hash/detail/" + options.uuid,
      params: {
        h: hash
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    /** block hash resault */
    if (data.info && data.list && Array.isArray(data.list)) {
      const info = data.info as Record<string, unknown>;
      return {
        code,
        msg,
        data: {
          hashType: 1,
          blockInfo: {
            blockHash: info._id as string,
            block: info.block as number,
            time: convertTime(info.time as number),
            past: (info.past as number) * 1000,
            transNum: info.transNum as number, // transaction counts in block
            parentHash: info.upperHash as string,
            totalCoins: info.totalCoins as string
          },
          blockDetails: (data.list as IBlockHashDetailInfo[]).map((tInfo) => {
            tInfo.hash = tInfo._id;
            tInfo.success = tInfo.succ;
            delete tInfo._id;
            delete tInfo.hashType;
            return tInfo;
          })
        }
      };
    }
    /** transaction hash resault */
    const hashDetails = {} as IHashDetailInfo;
    hashDetails.hash = data._id as string;
    hashDetails.success = data.succ as string;
    hashDetails.time = convertTime(data.time as number);
    hashDetails.past = (data.past as number) * 1000;
    hashDetails.blockHash = data.upperHash as string;
    delete data._id;
    delete data.succ;
    delete data.upperHash;
    delete data.hashType;

    return {
      code,
      msg,
      data: {
        hashType: 2,
        hashDetails: {
          ...data,
          ...hashDetails
        }
      }
    };
  }

  public async fetchBlockTransactionsByHash(
    options: IFetchBlockHashTransactionsOptions
  ): Promise<IFetchBlockHashTransactionsResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const hash = options.blockHash;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isValidString(hash), "Hash is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/hash/trans/" + options.uuid,
      params: {
        h: hash,
        p: page,
        s: size,
        n: 1 // this parameter seems to be bug, must be greater than 0
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const transactions = (data.list as IBlockHashDetailInfo[]) || [];
    transactions.forEach((trans) => {
      trans.hash = trans._id;
      trans.success = trans.succ;
      delete trans._id;
      delete trans.succ;
      delete trans.hashType;
    });
    return { code, msg, data: { transactions } };
  }

  public async fetchTokensInfo(options: IFetchTokensOptions): Promise<IFetchTokensResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/sum/tokenlist/" + options.uuid,
      params: {
        p: page,
        s: size,
        issuer: options.issuer || "",
        t: options.token || "" // this parameter seems to be bug
      }
    });

    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const tokens = (data.list as ITokenInfo[]) || [];
    tokens.forEach((t) => {
      if (t.issueDate > 0) {
        t.issueDate = convertTime(t.issueDate);
      }
      delete t.count;
    });
    return { code, msg, data: { tokens, count: data.count as number } };
  }

  public async fetchTokensCirculationInfo(
    options: IFetchTokensCirculationOptions
  ): Promise<IFetchTokensCirculationResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const { token, issuer } = options;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isValidString(token), "Token is invalid");
    if (!issuer) {
      assert(token.toUpperCase().startsWith("SWT"), "Issuer is invalid");
    }
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/sum/list/" + options.uuid,
      params: {
        p: page,
        s: size,
        t: token.toUpperCase() + "_" + issuer
      }
    });

    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const tokenInfo = {} as ITokenCirculationInfo;
    tokenInfo.holdersList = [];
    (Object.values(data) as Array<unknown>).forEach((v) => {
      if (typeof v !== "object") return;
      if (!Array.isArray(v)) {
        for (const key in v) {
          if (key === "tokens") {
            const [token, issuer] = v[key].split("_");
            tokenInfo.token = token as string;
            tokenInfo.issuer = issuer as string;
          } else if (key === "issueDate") {
            tokenInfo[key] = convertTime(v[key]);
          } else {
            tokenInfo[key] = v[key];
          }
        }
      } else if (v.length > 0 && typeof v[0] === "object") {
        tokenInfo.holdersList = v.map((h) => {
          return {
            address: h.address as string,
            amount: h.amount as string,
            time: convertTime(h.time as number)
          };
        });
      }
    });

    return { code, msg, data: { tokenInfo } };
  }

  public async fetchTokensList(
    options: IFetchTokensListOptions
  ): Promise<IFetchTokensListResponse | IFetchAllTokensListResponse> {
    const keyword = options.keyword || "";
    assert(typeof keyword === "string", "keyword is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/sum/all/" + options.uuid,
      params: {
        t: keyword.toUpperCase()
      }
    });

    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    let type = 0;
    let tokens = [];
    /** return all token list */
    if (keyword === "") {
      (Object.values(data) as Array<unknown>).forEach((v) => {
        for (const key in v as Record<string, unknown>) {
          tokens.push({
            firstLetter: key,
            list: (v[key] as Array<string>).map((name) => {
              const [token, issuer] = name.split("_");
              return { token, issuer };
            })
          });
        }
      });
    } else {
      /** return include keywords token list */
      type = 1;
      tokens = (Object.values(data) as Array<string>).map((name) => {
        const [token, issuer] = name.split("_");
        return { token, issuer };
      });
    }

    return { code, msg, data: { type, tokens } };
  }

  public async fetchTokensTradeStatistic(
    options: IFetchTokenTradeStatisticOptions
  ): Promise<IFetchTokenTradeStatisticResponse> {
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/sum/trans_num/" + options.uuid,
      params: {}
    });

    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const list = (Object.values(data) as Array<ITradeStatistic>).map((v) => {
      return {
        bBlock: v.bBlock as number,
        bTime: convertTime(v.bTime),
        eBlock: v.eBlock,
        eTime: convertTime(v.eTime),
        transNum: v.transNum,
        type: v.type
      };
    });
    return { code, msg, data: { list } };
  }

  public async fetchNewUserStatistic(options: IFetchUserStatisticOptions): Promise<IFetchUserStatisticResponse> {
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/sum/users_num/" + options.uuid,
      params: {}
    });

    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }

    const list = (Object.values(data) as Array<IUserStatistic>).map((v) => {
      return {
        bTime: convertTime(v.bTime),
        eTime: convertTime(v.eTime),
        total: v.total,
        userNum: v.userNum,
        type: v.type
      };
    });
    return { code, msg, data: { list } };
  }

  public async fetchTokenBalanceStatistic(
    options: IFetchTokenBalanceStatisticOptions
  ): Promise<IFetchTokenBalanceStatisticResponse> {
    const page = options.page || 0;
    const size = options.size || this.pageSize.TWENTY;
    const { address, token, beginTime, endTime } = options;
    assert(isValidPage(page), "Page is invalid");
    assert(isValidSize(size), "Size is invalid");
    assert(isValidString(address), "Address is invalid");
    assert(isValidString(token), "Token is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: "/sum/profit/balance/" + options.uuid,
      params: {
        w: address,
        t: token,
        p: page,
        s: size,
        b: beginTime,
        e: endTime
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const values = Object.values(data?.[0] || {})?.[0] || [];
    return {
      code,
      msg,
      data: {
        balances: values.map((v) => {
          const [date, value] = Object.values(v);
          return {
            time: convertTime(date as number),
            value: (value["value"] as string) || (value as string)
          };
        })
      }
    };
  }

  // get latst 50 transactions record from trading pair (base-counter)
  public async fetchLatestTransactions(
    options: IFetchLatestTransactionsOptions
  ): Promise<IFetchLatestTransactionsResponse> {
    const base = options.base?.toUpperCase();
    const counter = options.counter?.toUpperCase();
    assert(isValidString(base), "Base is invalid");
    assert(isValidString(counter), "Counter is invalid");
    const res: IResponse = await this.fetch({
      method: "get",
      baseURL: this.baseUrl,
      url: `/explorer/v1/info/history/${base}-${counter}/more/?uuid=${options.uuid}`,
      params: {}
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
    const records = Object.values(data) as Array<ITransactionRecord>;
    return { code, msg, data: { records }};
  }
}
