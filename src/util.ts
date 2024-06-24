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
  let valid = !isDef(v);
  if (!valid && typeof v === "string" && v !== "") {
    const types = v.split(",") as NftTransactionType[];
    const invalidType = (types).find((type) => {
      return !(type in NftTransactionType);
    });
    valid = !invalidType;
  }
  return valid;
};

export const isValidTransactionType = (v) => {
  let valid = v === "" || !isDef(v);
  if (!valid && typeof v === "string" && v !== "") {
    const types = v.split(",") as TransactionType[];
    const invalidType = (types).find((type) => {
      return !(type in TransactionType);
    });
    valid = !invalidType;
  }
  return valid;
};

export const isValidTradeType = (v) => {
  return TradeType.ALL === v || TradeType.BUY === v || TradeType.SELL === v;
};

export const isValidOrderType = (v) => {
  let valid = v === "" || !isDef(v);
  if (!valid && typeof v === "string") {
    const types = v.split(",") as OrderType[];
    const invalidType = (types).find((type) => {
      return !(type in OrderType);
    });
    valid = !invalidType;
  }
  return valid;
};

export const convertTime = (time: number): number => {
  return (time + 946684800) * 1000;
};

export const convertTimeToDate = (time: number): string => {
  const date = new Date(convertTime(time)).toLocaleDateString();
  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
