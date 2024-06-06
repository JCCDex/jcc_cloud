export interface IBaseRequest {}

export interface IUUID {
  uuid: string;
}

export interface IFetchBalancesOptions extends IUUID, IBaseRequest {
  address: string;
}

export interface IResponse {
  code: string;
  msg: string;
  data: Record<string, unknown>;
}

export interface IBalance {
  /**
   * Token name
   */
  currency: string;
  /**
   * Token balance (include frozen)
   */
  value: string;
  /**
   * Token frozen balance
   */
  frozen: string;
  /**
   * Token issuer address
   */
  issuer: string;
}

export interface IFetchBalancesResponse extends IResponse {
  data: {
    balances: IBalance[];
  };
}
