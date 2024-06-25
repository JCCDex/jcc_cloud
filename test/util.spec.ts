import { isValidNftTransactionType, isValidTransactionType, isValidOrderType } from "../src/util";
import { NftTransactionType, OrderType, TransactionType } from "../src/types";

describe("test isValidTransactionType", () => {
  describe("test isValidNftTransactionType", () => {
    it("return true if nft transaction type is valid", () => {
      const values = Object.values(NftTransactionType).join(",");
      expect(isValidNftTransactionType(values)).toBe(true);
      expect(isValidNftTransactionType("TokenIssue")).toBe(true);
      expect(isValidNftTransactionType("TokenIssue,TransferToken")).toBe(true);
      expect(isValidNftTransactionType(undefined)).toBe(true);
      expect(isValidNftTransactionType(null)).toBe(true);

      const v = isValidNftTransactionType("");
      console.log(v);
    });

    it("return false if nft transaction type is invalid", () => {
      expect(isValidNftTransactionType("TokenIssue,TransferToken,Invalid")).toBe(false);
      expect(isValidNftTransactionType("Invalid")).toBe(false);
      expect(isValidNftTransactionType("")).toBe(false);
      expect(isValidNftTransactionType({})).toBe(false);
    });
  });

  describe("test isValidOrderType", () => {
    it("return true if order type is valid", () => {
      const values = Object.values(OrderType).join(",");
      expect(isValidOrderType(values)).toBe(true);
      expect(isValidOrderType("OfferCreate")).toBe(true);
      expect(isValidOrderType("OfferCreate,Send")).toBe(true);
      expect(isValidOrderType(undefined)).toBe(true);
      expect(isValidOrderType(null)).toBe(true);
      expect(isValidOrderType("")).toBe(true);
    });

    it("return false if order type is invalid", () => {
      expect(isValidOrderType("OfferCreate,Send,Invalid")).toBe(false);
      expect(isValidOrderType("OfferCreate,Send, Invalid")).toBe(false);
      expect(isValidOrderType("Invalid")).toBe(false);
      expect(isValidOrderType({})).toBe(false);
    });
  });

  describe("test isValidTransactionType", () => {
    it("return true if transaction type is valid", () => {
      const values = Object.values(TransactionType).join(",");
      expect(isValidTransactionType(values)).toBe(true);
      expect(isValidTransactionType("OfferCreate")).toBe(true);
      expect(isValidTransactionType("OfferCreate,Payment")).toBe(true);
      expect(isValidTransactionType(undefined)).toBe(true);
      expect(isValidTransactionType(null)).toBe(true);
      expect(isValidTransactionType("")).toBe(true);
    });

    it("return false if transaction type is invalid", () => {
      expect(isValidTransactionType("OfferCreate,Payment,Invalid")).toBe(false);
      expect(isValidTransactionType("OfferCreate,Payment, Invalid")).toBe(false);
      expect(isValidTransactionType({})).toBe(false);
    });
  });
});
