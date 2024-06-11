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
  data: Record<string, any>;
}

export interface IBalance extends IToken {
  frozen: string; // Token frozen balance
}

export interface IFetchBalancesResponse extends IResponse {
  data: {
    balances: IBalance[];
  };
}

export interface IFetchOffersOptions extends IUUID, IBaseRequest {
  address: string;
  page?: number;
  size?: number;      // page size, default 20
  coinPair?: string;  // "JETH-JBNB"
  buyOrSell?: number; // trade type;  1: buy, 2: sell, default 0: all
}

export interface IOffer {
  time: number;       // the creation time of the offer order
  past: number;       // the time of offer order from now to creation time
  hash: string;       // offer order hash
  block: number;      // the block number of the offer order
  flag: number;       // offer order trade type;   1: buy, 2: sell
  takerGets: IToken;  // currency and quantity to be paid for the offer order
  takerPays: IToken;  // currency and quantity to be received for the offer order
  seq: number;        // the sequence number of the offer order 
}

export interface IFetchOffersResponse extends IResponse {
  data: {
    offers: IOffer[];
  };
}

export enum IOrderType {
  OfferCreate = "OfferCreate", 
  OfferAffect = "OfferAffect", 
  OfferCancel = "OfferCancel", 
  Send = "Send", 
  Receive = "Receive"
}

export interface IFetchHistoryOrdersOptions extends IUUID, IBaseRequest{
  address: string;
  page?: number;
  size?: number;        // page size, default 20
  beginTime?: string;   // the start time for query orders; format: "2021-1-1"
  endTime?: string;     // the end time for query order; format: "2021-3-31"
  type?: IOrderType;    // order type {"OfferCreate", "OfferAffect", "OfferCancel", "Send", "Receive"}
  buyOrSell?: number;   // trade type;  1: buy, 2: sell, default 0: all
  /**
   * 1. coinPair can be empty, not as query condition
   * 2. if type = "OfferCreate" or "OfferAffect" or "OfferCancel", coinPair only be like "JETH-JUSDT" or "JETH-" or "-JUSDT"
   * 3. if type = "Send" or "Receive", coinPair only be token Name and length must less than 8 like "JETH"
   */
  coinPair?: string;    // example: "JETH-JUSDT",  "JETH-",  "-JUSDT", "JETH" 
}

interface IBrokerage {
  platform: string;      // platform account
  feeAccount: string;    // fee account
  den: number;           // fee rate den
  num: number;           // fee rate num
  currency: string;      // fee currency
  issuer: string;        // issuer of currency
  value: string;         // fee quantity
}

export interface IHistoryOrder {
  type: string;            // order type
  time: number;            // the creation time of the order
  past: number;            // the time from now to order traded time
  hash: string;            // order hash
  block: number;           // the block number of the order
  fee: string;             // the fee of the order
  success: string;         // the status of the order
  seq: number;             // the sequence number of the order
  account?: string;        // the other party's account in this transfer order; when type = (Send, Receive)
  amount?: IToken;         // currency and quantity of this transfer order; when type = (Send, Receive)
  memos?: any[];           // the memo of the order; when type = (Send, Receive)
  flag?: number;           // trade type 1: buy, 2: sell; when type = (OfferCreate,OfferAffect,OfferCancel)
  matchFlag?: number;      // match flag; when type = (OfferCreate,OfferAffect)
  takerGets?: IToken;      // currency and quantity to be paid for the order; when type = (OfferCreate, OfferAffect, OfferCancel)
  takerPays?: IToken;      // currency and quantity to be received for the order; when type = (OfferCreate, OfferAffect, OfferCancel)
  takerGetsFact?: IToken;  // currency and quantity to be paid for the remaining portion of this order; when type = (OfferCreate, OfferAffect)
  takerPaysFact?: IToken;  // currency and quantity to be received for the remaining portion of this order; when type = (OfferCreate, OfferAffect)
  takerGetsMatch?: IToken; // currency and quantity paid for the completed portion of this order; when type = (OfferAffect, OfferAffect)
  takerPaysMatch?: IToken; // currency and quantity received for the completed portion of this order; when type = (OfferAffect, OfferAffect)
  offerSeq?: number;       // the sequence number of the canceled order; when type = (OfferCancel)
  platform?: string;       // the platform for order; when type = (OfferCreate, OfferAffect)
  brokerage?: IBrokerage   // the brokerage info of order; when type = (OfferCreate, OfferAffect)
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

export interface IFetchIssuedTokensResponse extends IResponse{
  data: {
    tokens: IIssueToken[];
  }
}

export interface IFetchHistoryFeesOptions extends IUUID, IBaseRequest {
  address: string;
  page?: number;
  size?: number;           // page size, default 20
  beginTime?: string;      // the start time for query fees; format: "2021-1-1"
  endTime?: string;        // the end time for query fees; format: "2021-3-31"
  tokenAndIssuer?: string; // token and issuer; example: "JETH_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
}

export interface IHistoryFee extends IToken{
  type: string;            // Fee
  block: number;           // block number of fee transaction
  time: number;            // creation time of fee transaction
  den: number;             // fee rate den
  num: number;             // fee rate num
  platform: string;        // platform account
  hash: string;            // fee transaction hash
}

export interface IFetchHistoryFeesResponse extends IResponse {
  data: {
    fees: IHistoryFee[];
  }
}