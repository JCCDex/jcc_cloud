export interface IBaseRequest {}

export interface IUUID {
  uuid: string;
}

export interface IToken {
  currency: string;
  issuer: string;
  value: string;
}

export interface IFetchBalancesOptions extends IUUID, IBaseRequest {
  address: string;
}

export interface IResponse {
  code: string;
  msg: string;
  data: Record<string, unknown>;
}

export interface IBalance extends IToken {
  frozen: string; // Token frozen balance
}

export interface IFetchBalancesResponse extends IResponse {
  data: {
    balances: IBalance[];
  };
}

export enum PageSize {
  TEN = 10,
  TWENTY = 20,
  FIFTY = 50,
  HUNDRED = 100
}

export enum TradeType {
  ALL = "",
  BUY = 1,
  SELL = 2
}

export interface IFetchOffersOptions extends IUUID, IBaseRequest {
  address: string;
  page?: number;
  size?: PageSize; // page size, default 20
  coinPair?: string; // "JETH-JBNB"
  buyOrSell?: TradeType; // trade type;  1: buy, 2: sell, default 0: all
}

export interface IOffer {
  time: number; // the creation time of the offer order
  past: number; // the time of offer order from now to creation time
  hash: string; // offer order hash
  block: number; // the block number of the offer order
  flag: number; // offer order trade type;   1: buy, 2: sell
  takerGets: IToken; // currency and quantity to be paid for the offer order
  takerPays: IToken; // currency and quantity to be received for the offer order
  seq: number; // the sequence number of the offer order
  getsV?: number;     // the value of takerGets
  paysV?: number;     // the value of takerPays
  gets_pays?: number; // the value of takerGets / takerPays,
  pays_gets?: number; // the value of takerPays / takerGets,
}

export interface IFetchOffersResponse extends IResponse {
  data: {
    offers: IOffer[];
  };
}

export enum OrderType {
  ALL = "",
  OFFERCREATE = "OfferCreate",
  OFFERAFFECT = "OfferAffect",
  OFFERCANCEL = "OfferCancel",
  SEND = "Send",
  RECEIVE = "Receive"
}

export interface IFetchHistoryOrdersOptions extends IUUID, IBaseRequest {
  address: string;
  page?: number;
  size?: PageSize; // page size, default 20
  beginTime?: string; // the start time for query orders; format: "2021-1-1"
  endTime?: string; // the end time for query order; format: "2021-3-31"
  type?: OrderType; // order type {"OfferCreate", "OfferAffect", "OfferCancel", "Send", "Receive"}
  buyOrSell?: TradeType; // trade type;  1: buy, 2: sell, default 0: all
  /**
   * 1. coinPair can be empty, not as query condition
   * 2. if type = "OfferCreate" or "OfferAffect" or "OfferCancel", coinPair only be like "JETH-JUSDT" or "JETH-" or "-JUSDT"
   * 3. if type = "Send" or "Receive", coinPair only be token Name and length must less than 8 like "JETH"
   */
  coinPair?: string; // example: "JETH-JUSDT",  "JETH-",  "-JUSDT", "JETH"
}

interface IBrokerage {
  platform: string; // platform account
  feeAccount: string; // fee account
  den: number; // fee rate den
  num: number; // fee rate num
  currency: string; // fee currency
  issuer: string; // issuer of currency
  value: string; // fee quantity
}

export interface IHistoryOrder {
  type: string; // order type
  time: number; // the creation time of the order
  past: number; // the time from now to order traded time
  hash: string; // order hash
  block: number; // the block number of the order
  fee: string; // the fee of the order
  success: string; // the status of the order
  seq: number; // the sequence number of the order
  account?: string; // the other party's account in this transfer order; when type = (Send, Receive)
  amount?: IToken; // currency and quantity of this transfer order; when type = (Send, Receive)
  memos?: unknown[]; // the memo of the order; when type = (Send, Receive)
  flag?: number; // trade type 1: buy, 2: sell; when type = (OfferCreate,OfferAffect,OfferCancel)
  matchFlag?: number; // match flag; when type = (OfferCreate,OfferAffect)
  takerGets?: IToken; // currency and quantity to be paid for the order; when type = (OfferCreate, OfferAffect, OfferCancel)
  takerPays?: IToken; // currency and quantity to be received for the order; when type = (OfferCreate, OfferAffect, OfferCancel)
  takerGetsFact?: IToken; // currency and quantity to be paid for the remaining portion of this order; when type = (OfferCreate, OfferAffect)
  takerPaysFact?: IToken; // currency and quantity to be received for the remaining portion of this order; when type = (OfferCreate, OfferAffect)
  takerGetsMatch?: IToken; // currency and quantity paid for the completed portion of this order; when type = (OfferAffect, OfferAffect)
  takerPaysMatch?: IToken; // currency and quantity received for the completed portion of this order; when type = (OfferAffect, OfferAffect)
  offerSeq?: number; // the sequence number of the canceled order; when type = (OfferCancel)
  platform?: string; // the platform for order; when type = (OfferCreate, OfferAffect)
  brokerage?: IBrokerage; // the brokerage info of order; when type = (OfferCreate, OfferAffect)
}

export interface IFetchHistoryOrdersResponse extends IResponse {
  data: {
    historOrders: IHistoryOrder[];
  };
}

export interface IFetchIssuedTokensOptions extends IFetchBalancesOptions {}

export interface IIssueToken {
  currency: string;
  issuer: string;
}

export interface IFetchIssuedTokensResponse extends IResponse {
  data: {
    tokens: IIssueToken[];
  };
}

export interface IFetchHistoryFeesOptions extends IUUID, IBaseRequest {
  address: string;
  page?: number;
  size?: PageSize; // page size, default 20
  beginTime?: string; // the start time for query fees; format: "2021-1-1"
  endTime?: string; // the end time for query fees; format: "2021-3-31"
  tokenAndIssuer?: string; // token and issuer; example: "JETH_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
}

export interface IHistoryFee extends IToken {
  type: string; // Fee
  block: number; // block number of fee transaction
  time: number; // creation time of fee transaction
  den: number; // fee rate den
  num: number; // fee rate num
  platform: string; // platform account
  hash: string; // fee transaction hash
}

export interface IFetchHistoryFeesResponse extends IResponse {
  data: {
    fees: IHistoryFee[];
  };
}

export interface IFetchBlockTransactionsOptions extends IUUID, IBaseRequest {
  blockNumber: number;
  page?: number;        // page if null, return all transactions
  size?: PageSize;      // page size, default 20
}

interface IMatchTradeInfo {
  account: string;      // be match trade account
  seq : number;         // match trade sequence
  flags: number;        // match trade flags
  previous: {           // before this match trade , the transaction info
    takerGets: IToken;  // currency and quantity to be paid for the transaction 
    takesPays: IToken;  // currency and quantity to be received for the transaction
  },   
  final: {              // after this match trade , the transaction info
    takerGets: IToken;  // currency and quantity to be paid for the transaction
    takesPays: IToken;  // currency and quantity to be received for the transaction
  },
  brokerage?: IBrokerage; // brokerage info of this match trade
}

export interface IBlockTransaction {
  _id?: string; // transaction hash
  hash: string; // transaction hash
  upperHash?: string; // block hash
  blockHash: string; // block hash
  block: number; // block number
  time: number; // transaction time (ms)
  index: number; // transaction index in block
  type: string; // transaction type ("Payment", "OfferCreate", "OfferCancel")
  account: string; // transaction account
  seq: number; // transaction sequence
  fee: number; // transaction gas fee
  success: string; // transaction status ("tesSUCCESS" means success)
  offerSeq?: number; // the sequence number of the canceled order; when type = "OfferCancel"
  memos?: unknown[]; // tansfer memo, when type = "Payment"
  dest?: string; // destination account, when type = "Payment"
  amount?: IToken; // transfer amount, when type = "Payment"
  platform?: string; // platform account, when type = "OfferCreate" | "OfferCancel"
  takerGets?: IToken; // currency and quantity to be paid for transaction; when type = "OfferCreate" | "OfferCancel"
  takerPays?: IToken; // currency and quantity to be received for transaction; when type = "OfferCreate" |"OfferCancel"
  realGets?: IToken; // actual remaining quantity to be paid of this transaction; when type = "OfferCreate"
  realPays?: IToken; // actual remaining quantity to be received of this transaction; when type = "OfferCreate"
  brokerage?: IBrokerage; // brokerage info of transaction; when type = "OfferCreate" | "OfferCancel"
  affectedNodes?: IMatchTradeInfo[]; // the matched trades info of this transaction; when type = "OfferCreate"
}

export interface IFetchBlockTransactionsResponse extends IResponse {
  data: {
    transactions: IBlockTransaction[];
    total: number;
  };
}

export interface IFetchLatestSixBlocksOptions extends IUUID, IBaseRequest {}

export interface IBlockInfo {
  _id?: number; // block number
  block: number; // block number
  time: number; // block born time or called block close time; (ms)
  transNum: number; // the number of transactions in this block
  hash: string; // block hash
  parentHash: string; // parent block hash
  past: number; // the time from now to block born time (ms)
}

export interface IFetchLatestSixBlocksResponse extends IResponse {
  data: {
    blocks: IBlockInfo[];
  };
}

export interface IFetchAllBlocksOptions extends IUUID, IBaseRequest {
  page?: number; // page default 0
  size?: PageSize; // page size, default 20
}

export interface IFetchAllBlocksResponse extends IResponse {
  data: {
    blocks: IBlockInfo[];
  };
}

export interface IFetchLatestSixHashOptions extends IUUID, IBaseRequest {}

export interface IHashInfo {
  _id?: string; // transaction hash
  hash: string; // transaction hash
  block: number; // block number
  time: number; // block close time (ms)
  type: string; // transaction type
  account: string; // account who started this transaction
  succ?: string; // transaction status (tesSUCCESS means success)
  success: string; // transaction status (tesSUCCESS means success)
  dest?: string; // destination account, when type = "Payment"
  amount?: IToken; // transfer amount, when type = "Payment"
  takerGets?: IToken; // currency and quantity to be paid for this transaction
  takerPays?: IToken; // currency and quantity to be received for this transaction
  realGets?: IToken; // actual remaining quantity to be paid of this transaction
  realPays?: IToken; // actual remaining quantity to be received of this transaction
  affectedNodes?: IMatchTradeInfo[]; // the matched trades info of this transaction
  past: number; // the time from now to transaction time (ms)
  flag?: number; // match trade flags
}

export interface IFetchLatestSixHashResponse extends IResponse {
  data: {
    hashInfos: IHashInfo[];
  };
}

export enum TransactionType {
  ALL = "",
  OFFERCREATE = "OfferCreate",
  OFFERCANCEL = "OfferCancel",
  PAYMENT = "Payment"
}

export interface IFetchAllHashOptions extends IUUID, IBaseRequest {
  page?: number; // page default 0
  size?: PageSize; // page size, default 20
  beginTime?: string; // the start time for query hash; format: "2021-1-1"
  endTime?: string; // the end time for query hash; format: "2021-3-31"
  type?: TransactionType; // transaction type {"OfferCreate", "OfferCancel", "payment"}
  buyOrSell?: TradeType; // trade type;  1: buy, 2: sell, default 0: all
  coinPair?: string; // example: "JETH-JUSDT",  "JETH-",  "-JUSDT", "JETH"
  matchFlag?: number; // match flag; this parameter seems to be invalid in testing
}

export interface IFetchAllHashResponse extends IResponse {
  data: {
    hashInfos: IHashInfo[];
    total: number;
  };
}

export interface IFetchHashDetailOptions extends IUUID, IBaseRequest {
  hash: string; // need to query hash
}

export interface IHashDetailInfo {
  
}

export interface IBlockHashDetailInfo {
  hashType?: number; // the query hash type from res; 1: block hash,  2: transaction hash
  _id?: string; // transaction hash
  hash: string; // transaction hash
  index?: number; // transaction index in block
  type: string; // transaction type ("Payment", "OfferCreate", "OfferCancel")
  account: string; // transaction account
  seq: number; // transaction sequence
  fee: number; // transaction gas fee
  succ?: string; // transaction status ("tesSUCCESS" means success)
  success: string; // transaction status ("tesSUCCESS" means success)
  offerSeq?: number; // the sequence number of the canceled order; when type = "OfferCancel"
  memos?: unknown[]; // tansfer memo, when type = "Payment"
  dest?: string; // destination account, when type = "Payment"
  amount?: IToken; // transfer amount, when type = "Payment"
  platform?: string; // platform account, when type = "OfferCreate" | "OfferCancel"
  takerGets?: IToken; // currency and quantity to be paid for transaction; when type = "OfferCreate" | "OfferCancel"
  takerPays?: IToken; // currency and quantity to be received for transaction; when type = "OfferCreate" |"OfferCancel"
  realGets?: IToken; // actual remaining quantity to be paid of this transaction; when type = "OfferCreate"
  realPays?: IToken; // actual remaining quantity to be received of this transaction; when type = "OfferCreate"
  brokerage?: IBrokerage; // brokerage info of transaction; when type = "OfferCreate" | "OfferCancel"
  affectedNodes?: IMatchTradeInfo[];
  flag?: number; // Active and passive transaction flag
}

export interface IFetchBlockHashDetailResponse extends IResponse {
  data: {
    hashType: number; // the query hash type from res; 1: block hash,  2: transaction hash
    blockInfo: {
      blockHash: string;
      block: number;
      time: number;
      past: number;
      transNum: number;
      parentHash: string;
      totalCoins: string;
    };
    blockDetails: IBlockHashDetailInfo[];
    total: number; // the number of transactions in this block
  };
}

export interface IHashDetailInfo extends IBlockHashDetailInfo{
    blockHash: string; // block hash,
    block: number; // block number,
    time: number; // transaction time (ms),
    past?: number; // the time from now to transaction time (ms),
    flag?: number; // match trade flags,
    matchGets?: IToken; // currency and quantity to be paid for the match trade; when flag = 1,
    matchPays?: IToken; // currency and quantity to be received for the match trade; when flag = 1,
}

export interface IFetchTransHashDetailResponse extends IResponse {
  data: {
    hashType: number; // the query hash type from res; 1: block hash,  2: transaction hash
    hashDetails: IHashDetailInfo;
  };
}

export interface IFetchBlockHashTransactionsOptions extends IUUID, IBaseRequest {
  blockHash: string;
  page?: number; // page default 0
  size?: PageSize; // page size, default 20
}

export interface IFetchBlockHashTransactionsResponse extends IResponse {
  data: {
    transactions: IBlockHashDetailInfo[];
  };
}

