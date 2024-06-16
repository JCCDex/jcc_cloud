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
  getsV?: number; // the value of takerGets
  paysV?: number; // the value of takerPays
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
  page?: number; // page if null, return all transactions
  size?: PageSize; // page size, default 20
}

interface IMatchTradeInfo {
  account: string; // be match trade account
  seq: number; // match trade sequence
  flags: number; // match trade flags
  previous: {
    // before this match trade , the transaction info
    takerGets: IToken; // currency and quantity to be paid for the transaction
    takesPays: IToken; // currency and quantity to be received for the transaction
  };
  final: {
    // after this match trade , the transaction info
    takerGets: IToken; // currency and quantity to be paid for the transaction
    takesPays: IToken; // currency and quantity to be received for the transaction
  };
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

export interface IFetchIssuerNftsOptions extends IUUID, IBaseRequest {
  issuer?: string;
  page?: number;
  size?: PageSize; // page size, default 20
}

export interface INft {
  fundCode: string;
  issuer: string;
  /**
   * 0: Valid
   */
  flags: number;
  fundCodeName: string;
  ledgerIndex: string;
  tokenIssued: string;
  tokenSize: string;
  hash: string;
  issuerAccountId: string;
  issuerTime: number;
}

export interface IIssuedNft {
  fundCode: string;
  issuer: string;
  /**
   * 0: Valid
   */
  flags: number;
  fundCodeName: string;
  count: number;
  destroy: number;
  issueCount: number;
  issueDate: number;
  totalCount: number;
}

export interface IFetchIssuerNftsResponse extends IResponse {
  data: {
    nfts: IIssuedNft[];
  };
}

export interface IFetchNftsByIdOrNameOptions extends IUUID, IBaseRequest {
  tokenId?: string;
  tokenName?: string;
}

export interface IFetchNftsByIdOrNameResponse extends IResponse {
  data: {
    tokenIds: string[];
    tokenNames: {
      name: string;
      holder: string;
    }[];
  };
}

export enum NftTransactionType {
  TokenIssue = "TokenIssue",
  TransferToken = "TransferToken",
  TokenDel = "TokenDel"
}

export interface IFetchNftTransfersOptions extends IUUID, IBaseRequest {
  address?: string;
  tokenId?: string;
  type?: NftTransactionType;
  page?: number;
  size?: PageSize;
  beginTime?: string;
  endTime?: string;
  counterparty?: string;
}

export interface INftTransfer {
  wallet: string;
  type: string;
  time: number;
  hash: string;
  block: number;
  fee: string;
  success: string;
  seq: number;
  offer: number;
  index: number;
  tokenId: string;
  flags: number;
  fundCode: string;
  fundCodeName: string;
  issuer: string;
  lowNode: string;
  tokenInfos: unknown[];
  tokenOwner: string;
  tokenSender: string;
}

export interface IFetchNftTransfersResponse extends IResponse {
  data: {
    transfers: INftTransfer[];
    count: number;
  };
}

export interface IFetchNftConfigsRequest extends IUUID, IBaseRequest {
  fundCodeName?: string;
  issuer?: string;
}

export interface IFetchNftConfigResponse extends IResponse {
  data: {
    nfts: INft[];
  };
}

export enum NFTStatus {
  Valid = 1,
  Invalid = 0
}

export interface IFetchNftTokenInfoRequest extends IUUID, IBaseRequest {
  tokenId?: string;
  address?: string;
  issuer?: string;
  fundCodeName?: string;
  valid?: NFTStatus;
  page?: number;
  size?: PageSize;
}

export interface INftTokenInfo {
  tokenId: string;
  flags: number;
  fundCode: string;
  fundCodeName: string;
  issuer: string;
  ledgerIndex: string;
  lowNode: string;
  tokenInfos: unknown[];
  tokenOwner: string;
  tokenSender: string;
  block: number;
  hash: string;
  index: number;
  inservice: number;
  issuerTime: number;
  time: number;
  type: string;
}

export interface IFetchNftTokenInfoResponse extends IResponse {
  data: {
    nfts: INftTokenInfo[];
    count: number;
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

export interface IFetchTokensOptions extends IUUID, IBaseRequest {
  page?: number;  // page default 0
  size?: PageSize; // page size, default 20
  issuer?: string; // token issuer
  token?: string; // token name, this parameter is seem to be invalid in testing
}

export interface ITokenInfo {
  count?: number; // the number of token holders
  block?: number; // the block number of token
  index?: number; // the index in block
  isNative: number; // 1: native token, 0: non-native token
  issueCount: string; // the number of issued tokens
  issueDate: number; // the issue date of token
  reserveCount: number; // the number of reserved tokens
  destory?: number; // the number of destroyed tokens
  token: string; // token name
  issuer: string; // token issuer,
  holdnum: number; // the number of token holders
}

export interface IFetchTokensResponse extends IResponse {
  data: {
    tokens: ITokenInfo[];
    total: number;
  };
}

export interface IFetchTokensCirculationOptions extends IUUID, IBaseRequest {
  token: string; // token name
  issuer: string; // token issuer
  page?: number; // holder list page, default 0
  size?: PageSize; // show holder list size, default 20
}

export interface ITokenCirculationInfo {
  token: string; // token name
  issuer: string; // token issuer
  issueDate: number; // the issue date of token
  totalsupply: string; // the num of total issued of token
  circulation: string; // the num of total circulation of token
  holders: number; // the number of token holders
  holdersList: { // the list of token holders
    address: string; // token holder address
    amount: string; // the amount of hold token
    time: number; // the time of statistics
  }[];
  flag: number; // the token status
}

export interface IFetchTokensCirculationResponse extends IResponse {
  data: {
    tokenInfo: ITokenCirculationInfo;
  };
}

export interface IFetchTokensListOptions extends IUUID, IBaseRequest {
  keyword?: string; // the token keyword for query
}

export interface ITokenName {
  token: string; // token name
  issuer: string; // token issuer
}

export interface IFetchTokensListResponse extends IResponse {
  data: {
    type: number; // list type, 0: all token list, 1: token list by keyword
    tokens: ITokenName[];
  };
}

export interface IFetchAllTokensListResponse extends IResponse {
  data: {
    type: number; // list type, 0: all token list, 1: token list by keyword
    tokens: {
        firstLetter: string; // the first letter of token name
        list: ITokenName[];
      }[];
  }
}

export interface IFetchTokenTradeStatisticOptions extends IUUID, IBaseRequest {}

export interface ITradeStatistic {
  bBlock: number; // begin block number of statistics
  bTime: number; // begin time of statistics
  eBlock: number; // end block number of statistics
  eTime: number; // end time of statistics
  transNum: number; // the number of all transactions in statistics
  type: number; // unknown -_-!
}

export interface IFetchTokenTradeStatisticResponse extends IResponse {
  data: {
    list: ITradeStatistic[];
  };
}

export interface IFetchUserStatisticOptions extends IUUID, IBaseRequest {}

export interface IUserStatistic {
  bTime: number; // begin time of statistics,
  eTime: number; // end time of statistics,
  total: number; // the number of all user in statistics
  userNum: number; // the number of new users added in statistics
  type: number; // unknown too -_-!
}

export interface IFetchUserStatisticResponse extends IResponse {
  data: {
    list: IUserStatistic[];
  }
}
