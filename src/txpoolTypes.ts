
export interface IBaseRequest {}

export interface IUUID {
  uuid: string;
}

export interface IResponse {
  code: string;
  msg: string;
  data: Record<string, unknown>;
}

export interface IToken {
  currency: string;
  issuer: string;
  value: string;
}

export interface IAccount {
  address: string;
  signedAddress: string;
  publicKey: string;
}

export enum FromChain {
  YES = 1,
  NO = 0
}

export interface IFetchSeqsOptions extends IUUID, IBaseRequest {
  publicKey: string;
  signedAddr: string;
  fromChain: number;
  count: number;
}

export interface IFetchSeqsResponse extends IResponse{
  data: {
    seqs: number[];
  };
}

export interface IBatchSignData {
  secret: string;
  txList: (ICreateExchange | ICancelExchange | IPayExchange)[];
  seqs: number[]; // need get from txpool service
}

export interface ITxPoolData {
  dataHashSign: string;
  dataJsonStr: string;
}

export interface ISubmitOptions extends IUUID, IBaseRequest {
  publicKey: string;
  submitPara: ITxPoolData;
}

export interface ISubmitResponse extends IResponse {
  data: {
    success: boolean;
  }
}

/**
 * 1: 只查询刚上传到交易服务，还未提交上链的数据
 * 2: 只查询提交上链出错的数据
 * 3: 只查询提交上链成功的数据
 * 4: 查询包含1和2的数据
 * 5: 查询还未确认上链是否成功的数据
 */
export enum QueryState {
  SentService = 1,
  SubmitChainError = 2,
  SubmitChainSuccess = 3,
  ServedAndChainError = 4,
  SubmitChainUnknow = 5
}

export enum QueryType {
  ONE = "one",  // 查询一个
  ALL = "total" // 查询全部
}

export interface IFetchSubmittedOptions extends IUUID, IBaseRequest{
  publicKey: string;
  state: QueryState | number; 
  count: QueryType | string;
}

export interface ISubmittedData {
  id: number,
  txSign: string,
  txHash: string,
  submitCount: number,
  checkCount: number,
  txState: number,
  txAddr: string,
  txSeq: number,
  createAt: string,
  updateAt: string
}
export interface IFetchSubmittedResponse extends IResponse {
  data: {
    list: ISubmittedData[];
  }
}

export interface ICancelSubmitOptions extends IUUID, IBaseRequest {
  publicKey: string;
  signedAddr: string;
}

export interface ICancelSubmitResponse extends IResponse {
  data: {
    canceled: boolean;
  }
}

export interface IMemo {
  Memo: {
    MemoType: string;
    MemoData: string;
  };
}

export interface ITakerGets {
  currency: string;
  issuer: string;
  value: string;
}

export interface ITakerPays {
  currency: string;
  issuer: string;
  value: string;
}

export interface ICreateExchange {
  Account: string;
  Fee: number;
  Flags: number;
  Platform: string;
  Sequence?: number;
  TakerGets: string | ITakerGets;
  TakerPays: string | ITakerPays;
  TransactionType: string;
}

export interface ICancelExchange {
  Account: string;
  Fee: number;
  Flags: number;
  OfferSequence: number;
  Sequence?: number;
  TransactionType: string;
}

export interface IPayExchange {
  Account: string;
  Amount: string | IToken;
  Destination: string;
  Fee: number;
  Flags: number;
  Sequence?: number;
  TransactionType: string;
  Memos: IMemo[];
}