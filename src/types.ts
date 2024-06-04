export interface IBaseRequest {
  timeout?: number;
}

export interface IUUID extends IBaseRequest {
  uuid: string;
}

export interface IFetchBalancesOptions extends IUUID {
  address: string;
}

export interface IResponse {
  code: string;
  msg: string;
  data: Record<string, unknown>;
}

export interface IBalance {
  currency: string;
  value: string;
  frozen: string;
  issuer: string;
}

export interface IFetchBalancesResponse extends IResponse {
  data: {
    balances: IBalance[];
  };
}
