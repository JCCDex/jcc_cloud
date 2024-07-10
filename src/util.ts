import { NFTStatus, NftTransactionType, PageSize, TransactionType, TradeType, OrderType } from "./types";
import { Wallet, ICreateExchange, ICancelExchange, IPayExchange } from "@jccdex/jingtum-lib";
import { QueryState, QueryType } from "./txpoolTypes";

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

export const isValidTxList = (v: (ICreateExchange | ICancelExchange | IPayExchange)[]) => {
  const wallet = new Wallet("jingtum");
  return Array.isArray(v) && v.length > 0 && v.every((tx) => {
    const type = tx.TransactionType as string;
    if (!isValidString(type) || !(type in TransactionType)) {
      return false;
    }
    switch (type) {
      case TransactionType.OfferCreate:
        return  'Account' in tx && wallet.isValidAddress(tx.Account) &&
                'Fee' in tx && typeof tx.Fee === 'number' &&
                'Flags' in tx && (tx.Flags === 0x00080000 || tx.Flags === 0) &&
                'Platform' in tx && typeof tx.Platform === 'string' &&
                'TakerGets' in tx && typeof tx.TakerGets === 'object' &&
                'TakerPays' in tx && typeof tx.TakerPays === 'object'
      case TransactionType.OfferCancel:
        return  'Account' in tx && wallet.isValidAddress(tx.Account) &&
                'Fee' in tx && typeof tx.Fee === 'number' &&
                'Flags' in tx && tx.Flags === 0 &&
                'OfferSequence' in tx && Number.isInteger(tx.OfferSequence)
      case TransactionType.Payment:
        return  'Account' in tx && wallet.isValidAddress(tx.Account) &&
                'Amount' in tx && (typeof tx.Amount === 'object' || typeof tx.Amount === 'string') &&
                'Destination' in tx && wallet.isValidAddress(tx.Destination) &&
                'Fee' in tx && typeof tx.Fee === 'number' &&
                'Flags' in tx && tx.Flags === 0 &&
                'Memos' in tx;
    }
  });
};

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