import { NFTStatus, NftTransactionType, PageSize } from "./types";

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