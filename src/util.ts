import { NFTStatus, NftTransactionType, PageSize, TransactionType, TradeType, OrderType } from "./types";

export const isDef = (v) => {
  return v !== undefined && v !== null;
};

export const isValidSize = (v) => {
  return PageSize.FIFTY === v || PageSize.HUNDRED === v || PageSize.TEN === v || PageSize.TWENTY === v;
};

export const isValidPage = (v) => {
  return typeof v === "number" && v >= 0;
};

export const isValidStatus = (v) => {
  return !isDef(v) || NFTStatus.Invalid === v || NFTStatus.Valid === v;
};

export const isValidNftTransactionType = (v) => {
  return (
    !isDef(v) ||
    NftTransactionType.TokenDel === v ||
    NftTransactionType.TokenIssue === v ||
    NftTransactionType.TransferToken === v
  );
};

export const isValidTransactionType = (v) => {
  return TransactionType.ALL === v || TransactionType.OFFERCANCEL === v || TransactionType.OFFERCREATE === v || TransactionType.PAYMENT === v; 
}

export const isValidTradeType = (v) => {
  return TradeType.ALL === v || TradeType.BUY === v || TradeType.SELL === v;
};

export const isValidOrderType = (v) => {
  return OrderType.ALL === v || OrderType.OFFERCANCEL === v || OrderType.OFFERCREATE === v || OrderType.OFFERAFFECT === v || OrderType.RECEIVE === v || OrderType.SEND === v;
}