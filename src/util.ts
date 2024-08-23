import { NFTStatus, NftTransactionType, PageSize, TransactionType, TradeType, OrderType } from "./types";
import { QueryState, QueryType, QueuesState, QueuesType } from "./txpoolTypes";

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

export const isEmptyString = (v) => {
  return typeof v === "string" && v === "";
};

export const isValidString = (v) => {
  return typeof v === "string" && v !== "";
};

export const valuesInEnum = (values, e): boolean => {
  const enums = Object.values(e);
  return values.every((v) => enums.includes(v));
};

export const isValidNftTransactionType = (v) => {
  return !isDef(v) || (isValidString(v) && valuesInEnum(v.split(","), NftTransactionType));
};

export const isValidTransactionType = (v) => {
  return !isDef(v) || isEmptyString(v) || (isValidString(v) && valuesInEnum(v.split(","), TransactionType));
};

export const isValidTradeType = (v) => {
  return TradeType.ALL === v || TradeType.BUY === v || TradeType.SELL === v;
};

export const isValidOrderType = (v) => {
  return !isDef(v) || isEmptyString(v) || (isValidString(v) && valuesInEnum(v.split(","), OrderType));
};

export const convertTime = (time: number): number => {
  return (time + 946684800) * 1000;
};

export const convertTimeToDate = (time: number): string => {
  const date = new Date(convertTime(time)).toLocaleDateString();
  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const isValidFromChain = (v: number) => {
  return v === 0 || v === 1;
};

export const isValidCount = (v: number) => {
  return Number.isInteger(v) && v > 0;
};

export const isValideSeqs = (v: number[]) => {
  return Array.isArray(v) && v.length > 0 && v.every((i) => Number.isInteger(i));
}

export const isValidQueryState = (v: number) => {
  return v in QueryState;
};
export const isValidQueryType = (v: string) => {
  return typeof v === 'string' && (v === QueryType.ALL || v === QueryType.ONE);
};

// copied from @swtc/common
export const funcBytesToHex = (bytes: Buffer) => {
  const hex = [];
  for (const byte of bytes) {
      const current = byte < 0 ? byte + 256 : byte;
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xf).toString(16));
  }
  return hex.join("").toUpperCase();
}

export const isValidQueuesState = (v: string) => {
  return typeof v === 'string' &&
    (v === QueuesState.WaittingSubmit
      || v === QueuesState.SubmitError 
      || v === QueuesState.WaittingConfirm);
};
export const isValidQueuesType = (v: string) => {
  return typeof v === 'string' && (v === QueuesType.SELF || v === QueuesType.TOTAL);
};