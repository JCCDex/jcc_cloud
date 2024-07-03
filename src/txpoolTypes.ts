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
    seqs: string[];
  };
}