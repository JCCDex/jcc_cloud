import sinon from "sinon";
import JCCDexExplorer from "../src/explorer";
import { CloudError } from "../src/error";
const fetch = require("../src/fetch");
const sandbox = sinon.createSandbox();

describe("test explorer", () => {
  const baseUrl = "https://swtcscan.jccdex.cn";
  const explorer = new JCCDexExplorer(baseUrl);
  const stub = sandbox.stub(fetch, "default");
  const timeOffset = explorer.timeOffset;

  describe("test fetchBalances", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchBalances({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchBalances({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return balances", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          SWTC: {
            value: "100000000",
            frozen: "0"
          },
          CNY_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: {
            value: "100000000",
            frozen: "0"
          }
        }
      });
      const res = await explorer.fetchBalances({
        uuid: "jGa9J9TkqtBc",
        address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/wallet/balance/jGa9J9TkqtBc",
          params: { w: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi" }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          balances: [
            {
              currency: "SWTC",
              value: "100000000",
              frozen: "0",
              issuer: ""
            },
            {
              currency: "CNY",
              value: "100000000",
              frozen: "0",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
            }
          ]
        }
      });
    });
  });

  describe("test fetchOffers", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchOffers({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchOffers({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return offers", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              time: 100,
              past: 1000,
              hash: "hash",
              block: 1000,
              flag: 1,
              takerGets: {
                currency: "SWTC",
                value: "100000000",
                issuer: ""
              },
              takerPays: {
                currency: "CNY",
                value: "100000000",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
              },
              seq: 1000
            }
          ]
        }
      });
      const res = await explorer.fetchOffers({
        uuid: "jGa9J9TkqtBc",
        address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
        size: explorer.pageSize.TEN,
        buyOrSell: explorer.tradeType.ALL
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/wallet/offer/jGa9J9TkqtBc",
          params: { 
            w: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
            p: 0,
            s: 10,
            c: "",
            bs: ""
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          offers: [
            {
              time: 100000 + timeOffset,
              past: 1000000,
              hash: "hash",
              block: 1000,
              flag: 1,
              takerGets: {
                currency: "SWTC",
                value: "100000000",
                issuer: ""
              },
              takerPays: {
                currency: "CNY",
                value: "100000000",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
              },
              seq: 1000
            }
          ]
        }
      });
    });
  });

  describe("test fetchHistoryOrders", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchHistoryOrders({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchHistoryOrders({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return historyOrders", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              type: 'OfferCreate',
              time: 100,
              hash: 'A5FAED341A6292447F130056A68ACB2155AE0C37287D04CF12DD17CCE1C0AA2B',
              block: 28818929,
              fee: 0.001,
              success: 'tesSUCCESS',
              seq: 1382376,
              takerGets: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '20.028'
              },
              takerPays: {
                currency: 'JUNI',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '2'
              },
              takerGetsFact: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '20.028'
              },
              takerPaysFact: {
                currency: 'JUNI',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '2'
              },
              past: 103,
              flag: 1
            }
          ]
        }
      });
      const res = await explorer.fetchHistoryOrders({
        uuid: "jGa9J9TkqtBc",
        address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
        size: explorer.pageSize.FIFTY,
        type: explorer.orderType.OFFERCREATE,
        buyOrSell: explorer.tradeType.BUY
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/wallet/trans/jGa9J9TkqtBc",
          params: { 
            w: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
            p: 0,
            s: 50,
            b: "",
            e: "",
            t: "OfferCreate",
            c: "",
            bs: 1
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          historOrders: [
            {
              type: explorer.orderType.OFFERCREATE,
              time: 100000 + timeOffset,
              hash: 'A5FAED341A6292447F130056A68ACB2155AE0C37287D04CF12DD17CCE1C0AA2B',
              block: 28818929,
              fee: 0.001,
              success: 'tesSUCCESS',
              seq: 1382376,
              takerGets: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '20.028'
              },
              takerPays: {
                currency: 'JUNI',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '2'
              },
              takerGetsFact: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '20.028'
              },
              takerPaysFact: {
                currency: 'JUNI',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '2'
              },
              past: 103000,
              flag: 1
            }
          ]
        }
      });
    });
  });

  describe("test fetchIssuedTokens", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchIssuedTokens({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchIssuedTokens({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return tokens", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi": [
            {
              "currency": "CNY",
              "issuer": "jGwru5JHQ2y9iHqF4LwqWjrQinyBqoxzd5"
            },
            {
              "currency": "EUR",
              "issuer": "jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"
            },
            {
              "currency": "8000000000000000000000007F92BA0351D9547B",
              "issuer": "jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"
            }
          ]
        }
      });
      const res = await explorer.fetchIssuedTokens({
        uuid: "jGa9J9TkqtBc",
        address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/wallet/fingate_tokenlist/jGa9J9TkqtBc",
          params: { w: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi" }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          tokens: [
            { 
              currency: 'CNY',
              issuer: 'jGwru5JHQ2y9iHqF4LwqWjrQinyBqoxzd5'
            },
            { 
              currency: 'EUR',
              issuer: 'jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf'
            },
            {
              currency: '8000000000000000000000007F92BA0351D9547B',
              issuer: 'jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf'
            }
          ]
        }
      });
    });
  });

  describe("test fetchHistoryFees", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchHistoryFees({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchHistoryFees({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return fees", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "list": [
            {
              "type": "Fee",
              "block": 28809485,
              "time": 100,
              "currency": "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "value": "0.0019904444765127",
              "den": 1000,
              "num": 2,
              "platform": "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto",
              "hash": "B8181A68686D8AFC276DDABD132C55760255D0096DCFC2AD81EC58E029421AF2"
            },
            {
              "type": "Fee",
              "block": 28809485,
              "time": 200,
              "currency": "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "value": "0.0092025487034873",
              "den": 1000,
              "num": 2,
              "platform": "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto",
              "hash": "91DA75B6E07A2CF09C919A0B834000044A99F0840ACF1BFD0823FE59A8D186E3"
            }
          ]
        }
      });
      const res = await explorer.fetchHistoryFees({
        uuid: "jGa9J9TkqtBc",
        address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
        size: explorer.pageSize.HUNDRED,
        tokenAndIssuer: "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/wallet/trans/fee/jGa9J9TkqtBc",
          params: { 
            w: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi", 
            p: 0,
            s: 100,
            b: "",
            e: "",
            c: "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            t: "Fee",
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          fees: [
            {
              type: 'Fee',
              block: 28809485,
              time: 100000 + timeOffset,
              currency: 'JUSDT',
              value: '0.0019904444765127',
              den: 1000,
              num: 2,
              platform: 'jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto',
              hash: 'B8181A68686D8AFC276DDABD132C55760255D0096DCFC2AD81EC58E029421AF2',
              issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
            },
            {
              type: 'Fee',
              block: 28809485,
              time: 200000 + timeOffset,
              currency: 'JUSDT',
              value: '0.0092025487034873',
              den: 1000,
              num: 2,
              platform: 'jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto',
              hash: '91DA75B6E07A2CF09C919A0B834000044A99F0840ACF1BFD0823FE59A8D186E3',
              issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
            }
          ]
        }
      });
    });
  });

  describe("test fetchBlockTransactions", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchBlockTransactions({
          uuid: "jGa9J9TkqtBc",
          blockNumber: 20545139,
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchBlockTransactions({
          uuid: "jGa9J9TkqtBc",
          blockNumber: 20545139,
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return transactions", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "list": [
            {
              "_id": "3FBDAE6E57131B8E367270FA7524A11423C7B0E127DA789BE289CCDAD5A21CFD",
              "upperHash": "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3",
              "block": 28824756,
              "time": 771413360,
              "index": 0,
              "type": "Payment",
              "account": "jB6p3U47Faj8b21nzEoXsNjfBMsj9hGgth",
              "seq": 2,
              "fee": 0.01,
              "succ": "tesSUCCESS",
              "dest": "jHeqgUVFeDoiBcqeva2HCUSNk683UZfihP",
              "amount": {
                  "currency": "WUSDT",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "50.94586808"
              }
            },
            {
              "_id": "7401BAA50F0DA374DEC1F11FBFE06C30F03245BA04BB41687A813C49F51B92D0",
              "upperHash": "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3",
              "block": 28824756,
              "time": 771413360,
              "index": 2,
              "type": "OfferCreate",
              "account": "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
              "seq": 2150223,
              "fee": 0.01,
              "succ": "tesSUCCESS",
              "takerGets": {
                  "currency": "CSP",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "2280.01833525"
              },
              "takerPays": {
                  "currency": "CCMOAC",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "14.24939964"
              },
              "platform": "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
              "affectedNodes": [
                {
                  "account": "jBzGwUJtCm9cR8CKgfsSkMs647TB6eKC9D",
                  "seq": 3634,
                  "flags": 131072,
                  "previous": {
                      "takerGets": {
                          "currency": "CCMOAC",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "29.45283332771408"
                      },
                      "takerPays": {
                          "currency": "CSP",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "4676.821263733587"
                      }
                  },
                  "final": {
                      "takerGets": {
                          "currency": "CCMOAC",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "15.09414903652932"
                      },
                      "takerPays": {
                          "currency": "CSP",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "2396.802928483587"
                      }
                  },
                  "brokerage": {
                      "platform": "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                      "feeAccount": "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                      "den": 1000,
                      "num": 2,
                      "currency": "CSP",
                      "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      "value": "4.5600366705"
                  }
                }
              ],
              "brokerage": {
                  "platform": "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                  "feeAccount": "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                  "den": 1000,
                  "num": 2,
                  "currency": "CCMOAC",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "0.02871736858236952"
              }
            },
            {
              "_id": "90973C48858F00661E6908CA95653C25CE17BEB0D0C4888071B14B107DB0DBEA",
              "upperHash": "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3",
              "block": 28824756,
              "time": 771413360,
              "index": 3,
              "type": "OfferCancel",
              "account": "jJG5GYgs6LE1phryL4vVMPyTrf7px6LQXW",
              "seq": 46970,
              "fee": 0.00001,
              "succ": "tesSUCCESS",
              "offerSeq": 42032,
              "takerGets": {
                  "currency": "JUSDT",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "1.7028459598464"
              },
              "takerPays": {
                  "currency": "JBTC",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "0.000030003930519"
              }
            }
          ],
          "count": 3
        }
      });
      const res = await explorer.fetchBlockTransactions({
        uuid: "jGa9J9TkqtBc",
        blockNumber: 28824756
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/block/trans/jGa9J9TkqtBc",
          params: { 
            b: 28824756,
            p: "",
            s: 20
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          transactions: [
            {
              block: 28824756,
              time: 1718098160000,
              index: 0,
              type: 'Payment',
              account: 'jB6p3U47Faj8b21nzEoXsNjfBMsj9hGgth',
              seq: 2,
              fee: 0.01,
              succ: 'tesSUCCESS',
              dest: 'jHeqgUVFeDoiBcqeva2HCUSNk683UZfihP',
              amount: {
                currency: 'WUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '50.94586808'
              },
              hash: '3FBDAE6E57131B8E367270FA7524A11423C7B0E127DA789BE289CCDAD5A21CFD',
              blockHash: '3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3'
            },
            {
              block: 28824756,
              time: 1718098160000,
              index: 2,
              type: 'OfferCreate',
              account: 'j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi',
              seq: 2150223,
              fee: 0.01,
              succ: 'tesSUCCESS',
              takerGets: {
                currency: 'CSP',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '2280.01833525'
              },
              takerPays: {
                currency: 'CCMOAC',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '14.24939964'
              },
              platform: 'jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5',
              affectedNodes: [
                {
                  account: 'jBzGwUJtCm9cR8CKgfsSkMs647TB6eKC9D',
                  seq: 3634,
                  flags: 131072,
                  previous: {
                    takerGets: {
                      currency: 'CCMOAC',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '29.45283332771408'
                    },
                    takerPays: {
                      currency: 'CSP',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '4676.821263733587'
                    }
                  },
                  final: {
                    takerGets: {
                      currency: 'CCMOAC',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '15.09414903652932'
                    },
                    takerPays: {
                      currency: 'CSP',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '2396.802928483587'
                    }
                  },
                  brokerage: {
                    platform: 'jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5',
                    feeAccount: 'jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN',
                    den: 1000,
                    num: 2,
                    currency: 'CSP',
                    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                    value: '4.5600366705'
                  }
                }
              ],
              brokerage: {
                platform: 'jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5',
                feeAccount: 'jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN',
                den: 1000,
                num: 2,
                currency: 'CCMOAC',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.02871736858236952'
              },
              hash: '7401BAA50F0DA374DEC1F11FBFE06C30F03245BA04BB41687A813C49F51B92D0',
              blockHash: '3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3'
            },
            {
              block: 28824756,
              time: 1718098160000,
              index: 3,
              type: 'OfferCancel',
              account: 'jJG5GYgs6LE1phryL4vVMPyTrf7px6LQXW',
              seq: 46970,
              fee: 0.00001,
              succ: 'tesSUCCESS',
              offerSeq: 42032,
              takerGets: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '1.7028459598464'
              },
              takerPays: {
                currency: 'JBTC',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.000030003930519'
              },
              hash: '90973C48858F00661E6908CA95653C25CE17BEB0D0C4888071B14B107DB0DBEA',
              blockHash: '3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3'
            }
          ],
          total: 3
        }
      });
    });
  });

  describe("test fetchLatestSixBlocks", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchLatestSixBlocks({uuid: "jGa9J9TkqtBc"});
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchLatestSixBlocks({uuid: "jGa9J9TkqtBc"})
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return blocks", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "list": [
            {
              "_id": 28833309,
              "hash": "787900085563AF65D568382A613C79A85D730456EF5F3CB52FF991062569AB93",
              "parentHash": "5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA",
              "time": 771498890,
              "transNum": 7,
              "past": 18
            },
            {
              "_id": 28833308,
              "hash": "5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA",
              "parentHash": "839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8",
              "time": 771498880,
              "transNum": 13,
              "past": 28
            },
            {
              "_id": 28833307,
              "hash": "839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8",
              "parentHash": "95628DEF0BB90F62D49166B4F8B5B874AACF4AA1E65B914380E05E854C675723",
              "time": 771498870,
              "transNum": 0,
              "past": 38
            }
          ]
        }
      });
      const res = await explorer.fetchLatestSixBlocks({uuid: "jGa9J9TkqtBc"});

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/block/new/jGa9J9TkqtBc",
          params: {}
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          blocks: [
            {
              hash: '787900085563AF65D568382A613C79A85D730456EF5F3CB52FF991062569AB93',
              parentHash: '5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA',
              time: 1718183690000,
              transNum: 7,
              past: 18000,
              block: 28833309
            },
            {
              hash: '5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA',
              parentHash: '839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8',
              time: 1718183680000,
              transNum: 13,
              past: 28000,
              block: 28833308
            },
            {
              hash: '839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8',
              parentHash: '95628DEF0BB90F62D49166B4F8B5B874AACF4AA1E65B914380E05E854C675723',
              time: 1718183670000,
              transNum: 0,
              past: 38000,
              block: 28833307
            }
          ]
        }
      });
    });
  });

  describe("test fetchAllBlocks", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchAllBlocks({uuid: "jGa9J9TkqtBc"});
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchAllBlocks({uuid: "jGa9J9TkqtBc"})
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return blocks", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "list": [
            {
              "_id": 28833422,
              "hash": "F4B2723148C739F54C5D72E03E487C74F25207CBA5E62216291E674FAAAB65DF",
              "parentHash": "6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69",
              "time": 771500020,
              "transNum": 2,
              "past": 14
            },
            {
              "_id": 28833421,
              "hash": "6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69",
              "parentHash": "35FEA85D76089D757B86B2ABD7BDD71161206702C743621F738A6DC2A3682596",
              "time": 771500010,
              "transNum": 0,
              "past": 24
            }
          ]
        }
      });
      const res = await explorer.fetchAllBlocks({uuid: "jGa9J9TkqtBc"});

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/block/all/jGa9J9TkqtBc",
          params: {
            p: 0,
            s: 20
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          blocks: [
            {
              hash: 'F4B2723148C739F54C5D72E03E487C74F25207CBA5E62216291E674FAAAB65DF',
              parentHash: '6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69',
              time: 1718184820000,
              transNum: 2,
              past: 14000,
              block: 28833422
            },
            {
              hash: '6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69',
              parentHash: '35FEA85D76089D757B86B2ABD7BDD71161206702C743621F738A6DC2A3682596',
              time: 1718184810000,
              transNum: 0,
              past: 24000,
              block: 28833421
            }
          ]
        }
      });
    });
  });

  describe("test fetchLatestSixHash", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchLatestSixHash({uuid: "jGa9J9TkqtBc"});
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchLatestSixHash({uuid: "jGa9J9TkqtBc"})
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return blocks", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "list": [
            {
              "_id": "DD59FFB5A193ABF0690C858DFB61B4FA6B6B1BD9D40F3C2C3AED9E4FD69824FE",
              "block": 28844593,
              "time": 771611730,
              "type": "OfferCreate",
              "account": "jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv",
              "succ": "tesSUCCESS",
              "takerGets": {
                  "currency": "JMBOX",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "0.170728102562769"
              },
              "takerPays": {
                  "currency": "JJST",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "1.793827527104485"
              },
              "realGets": {
                  "currency": "JMBOX",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "0.170728102562769"
              },
              "realPays": {
                  "currency": "JJST",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "1.793827527104485"
              },
              "past": 10
            },
            {
              "_id": "E4107FEE38918287F572CDB688828FB79E68CF0C47ED1F9AB8D93660B48A35F1",
              "block": 28844593,
              "time": 771611730,
              "type": "OfferCreate",
              "account": "jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv",
              "succ": "tesSUCCESS",
              "takerGets": {
                  "currency": "JMBOX",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "0.123293942931793"
              },
              "takerPays": {
                  "currency": "JJST",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "1.303341491121857"
              },
              "realGets": {
                  "currency": "JMBOX",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "0.123293942931793"
              },
              "realPays": {
                  "currency": "JJST",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "1.303341491121857"
              },
              "past": 10
            }
          ]
        }
      });
      const res = await explorer.fetchLatestSixHash({uuid: "jGa9J9TkqtBc"});

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/trans/new/jGa9J9TkqtBc",
          params: {}
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          hashInfos: [
            {
              block: 28844593,
              time: 1718296530000,
              type: 'OfferCreate',
              account: 'jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv',
              succ: 'tesSUCCESS',
              takerGets: {
                currency: 'JMBOX',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.170728102562769'
              },
              takerPays: {
                currency: 'JJST',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '1.793827527104485'
              },
              realGets: {
                currency: 'JMBOX',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.170728102562769'
              },
              realPays: {
                currency: 'JJST',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '1.793827527104485'
              },
              past: 10000,
              hash: 'DD59FFB5A193ABF0690C858DFB61B4FA6B6B1BD9D40F3C2C3AED9E4FD69824FE'
            },
            {
              block: 28844593,
              time: 1718296530000,
              type: 'OfferCreate',
              account: 'jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv',
              succ: 'tesSUCCESS',
              takerGets: {
                currency: 'JMBOX',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.123293942931793'
              },
              takerPays: {
                currency: 'JJST',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '1.303341491121857'
              },
              realGets: {
                currency: 'JMBOX',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.123293942931793'
              },
              realPays: {
                currency: 'JJST',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '1.303341491121857'
              },
              past: 10000,
              hash: 'E4107FEE38918287F572CDB688828FB79E68CF0C47ED1F9AB8D93660B48A35F1'
            }
          ]
        }
      });
    });
  });

  describe("test fetchAllHash", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchAllHash({uuid: "jGa9J9TkqtBc"});
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchAllHash({uuid: "jGa9J9TkqtBc"})
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return hashInfos", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "list": [
            {
              "_id": "E6CF5244EB3E3C2BF433AE01F49CDC4609DBC6C0F46806A7B81780240E815817",
              "block": 28844738,
              "time": 771613180,
              "type": "OfferCreate",
              "account": "jBcHrPr3W1tzzLhqjTKXwo2zt4fpm3AaQp",
              "succ": "tesSUCCESS",
              "takerGets": {
                "currency": "JUNI",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "0.007165188"
              },
              "takerPays": {
                "currency": "JUSDT",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "0.070677414"
              },
              "affectedNodes": [
                {
                  "account": "jaz2J561QDxdd5xkH6rrRtTDhL5ZTrdWm4",
                  "seq": 37422,
                  "flags": 0,
                  "previous": {
                      "takerGets": {
                          "currency": "JUSDT",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "48.68861190148087"
                      },
                      "takerPays": {
                          "currency": "JUNI",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "4.93599066316716"
                      }
                  },
                  "final": {
                      "takerGets": {
                          "currency": "JUSDT",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "48.61793448704887"
                      },
                      "takerPays": {
                          "currency": "JUNI",
                          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                          "value": "4.92882547516716"
                      }
                  },
                  "brokerage": {
                      "platform": "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                      "feeAccount": "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                      "den": 1000,
                      "num": 2,
                      "currency": "JUNI",
                      "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      "value": "0.000014330376"
                  }
                }
              ],
              "past": 10,
              "flag": 2
            }
          ],
          "count": 1000000
        }
      });
      const res = await explorer.fetchAllHash({uuid: "jGa9J9TkqtBc"});

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/trans/all/jGa9J9TkqtBc",
          params: {
            p: 0,
            s: 20,
            b: "",
            e: "",
            t: explorer.transactionType.ALL,
            bs: explorer.tradeType.ALL,
            c: "",
            f: ""
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          hashInfos: [
            {
              hash: 'E6CF5244EB3E3C2BF433AE01F49CDC4609DBC6C0F46806A7B81780240E815817',
              block: 28844738,
              time: 1718297980000,
              type: 'OfferCreate',
              account: 'jBcHrPr3W1tzzLhqjTKXwo2zt4fpm3AaQp',
              success: 'tesSUCCESS',
              takerGets: {
                currency: 'JUNI',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.007165188'
              },
              takerPays: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '0.070677414'
              },
              affectedNodes: [
                {
                  account: 'jaz2J561QDxdd5xkH6rrRtTDhL5ZTrdWm4',
                  seq: 37422,
                  flags: 0,
                  previous: {
                    takerGets: {
                      currency: 'JUSDT',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '48.68861190148087'
                    },
                    takerPays: {
                      currency: 'JUNI',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '4.93599066316716'
                    }
                  },
                  final: {
                    takerGets: {
                      currency: 'JUSDT',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '48.61793448704887'
                    },
                    takerPays: {
                      currency: 'JUNI',
                      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                      value: '4.92882547516716'
                    }
                  },
                  brokerage: {
                    platform: 'jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5',
                    feeAccount: 'jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN',
                    den: 1000,
                    num: 2,
                    currency: 'JUNI',
                    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                    value: '0.000014330376'
                  }
                }
              ],
              past: 10000,
              flag: 2
            }
          ],
          total: 1000000
        }
      });
    });
  });

  describe("test fetchHashDetailInfo", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchHashDetailInfo({
          uuid: "jGa9J9TkqtBc",
          hash: "1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchHashDetailInfo({
          uuid: "jGa9J9TkqtBc",
          hash: "1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return hash Detail if query transaction hash", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "_id": "1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6",
          "hashType": 2,
          "upperHash": "E4E6FADB033CF401CF494B7D047B7FC00F273CDF7C156E94D17C688FBDC01704",
          "block": 28842246,
          "time": 771588260,
          "type": "OfferCreate",
          "account": "jB6GhwX8QX1NM3YpjAEwPKseHqkMWZKk8K",
          "seq": 161612,
          "fee": 0.00001,
          "succ": "tesSUCCESS",
          "memos": [
              {
                  "Memo": {
                      "MemoData": ""
                  }
              }
          ],
          "takerGets": {
              "currency": "JETH",
              "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "value": "0.002506556601902"
          },
          "takerPays": {
              "currency": "JUNI",
              "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "value": "0.894973621484745"
          },
          "platform": "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
          "realGets": {
              "currency": "JETH",
              "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "value": "0.002506556601902"
          },
          "realPays": {
              "currency": "JUNI",
              "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "value": "0.894973621484745"
          },
          "affectedNodes": [],
          "past": 18929,
          "flag": 1
        }
      });
      const res = await explorer.fetchHashDetailInfo({
        uuid: "jGa9J9TkqtBc",
        hash: "1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/hash/detail/jGa9J9TkqtBc",
          params: {
            h: "1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6"
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          hashType: 2,
          hashDetails: {
            hash: '1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6',
            blockHash: 'E4E6FADB033CF401CF494B7D047B7FC00F273CDF7C156E94D17C688FBDC01704',
            block: 28842246,
            time: 1718273060000,
            type: 'OfferCreate',
            account: 'jB6GhwX8QX1NM3YpjAEwPKseHqkMWZKk8K',
            seq: 161612,
            fee: 0.00001,
            success: 'tesSUCCESS',
            memos: [ { Memo: { MemoData: '' } } ],
            takerGets: {
              currency: 'JETH',
              issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
              value: '0.002506556601902'
            },
            takerPays: {
              currency: 'JUNI',
              issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
              value: '0.894973621484745'
            },
            platform: 'jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5',
            realGets: {
              currency: 'JETH',
              issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
              value: '0.002506556601902'
            },
            realPays: {
              currency: 'JUNI',
              issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
              value: '0.894973621484745'
            },
            affectedNodes: [],
            past: 18929000,
            flag: 1
          }
        }
      });
    });

    test("should return block info and block Detail if query block hash", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "info": {
            "_id": "8D9DEB75B007DF54AB0B8E5FE3873C367EF3025B6566E5075DE9AA5C3520B794",
            "hashType": 1,
            "upperHash": "",
            "block": 28842212,
            "time": 771587920,
            "transNum": 2,
            "parentHash": "6385743AA703AAFD795D14FF787F985CDF27F58F87F5AC662D8283360426645F",
            "totalCoins": "599999999999460713",
            "past": 20651
          },
          "list": [
            {
              "_id": "3816D1F4F6EAAF145ABCC598E454068EA7A2125B6CDBACA213D582607A5D2013",
              "hashType": 2,
              "index": 0,
              "type": "Payment",
              "account": "jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p",
              "seq": 29916,
              "fee": 0.01,
              "succ": "tesSUCCESS",
              "dest": "jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4",
              "amount": {
                  "currency": "WTRX",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "444.8086"
              }
            },
            {
              "_id": "7148B37BA0EF0CFB9A3EBE0290979A44E542F01BEAF816D683AC82408CE026FC",
              "hashType": 2,
              "index": 1,
              "type": "OfferCreate",
              "account": "ja2rF7o54ydxJgwa1Vnf5wmxf2c3UmnB6A",
              "seq": 28988,
              "fee": 0.00001,
              "succ": "tesSUCCESS",
              "takerGets": {
                  "currency": "JVEE",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "76.81644921999999"
              },
              "takerPays": {
                  "currency": "SWTC",
                  "issuer": "",
                  "value": "57364.65749"
              },
              "platform": "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
              "realGets": {
                  "currency": "JVEE",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "76.81644921999999"
              },
              "realPays": {
                  "currency": "SWTC",
                  "issuer": "",
                  "value": "57364.65749"
              },
              "flag": 2
            }
          ],
          "count": 2
        }
      });
      const res = await explorer.fetchHashDetailInfo({
        uuid: "jGa9J9TkqtBc",
        hash: "8D9DEB75B007DF54AB0B8E5FE3873C367EF3025B6566E5075DE9AA5C3520B794"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/hash/detail/jGa9J9TkqtBc",
          params: {
            h: "8D9DEB75B007DF54AB0B8E5FE3873C367EF3025B6566E5075DE9AA5C3520B794"
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          hashType: 1,
          blockInfo: {
            blockHash: '8D9DEB75B007DF54AB0B8E5FE3873C367EF3025B6566E5075DE9AA5C3520B794',
            block: 28842212,
            time: 1718272720000,
            past: 20651000,
            transNum: 2,
            parentHash: '',
            totalCoins: '599999999999460713'
          },
          blockDetails: [
            {
              _id: '3816D1F4F6EAAF145ABCC598E454068EA7A2125B6CDBACA213D582607A5D2013',
              hashType: 2,
              index: 0,
              type: 'Payment',
              account: 'jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p',
              seq: 29916,
              fee: 0.01,
              succ: 'tesSUCCESS',
              dest: 'jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4',
              amount: {
                currency: 'WTRX',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '444.8086'
              },
              hash: '3816D1F4F6EAAF145ABCC598E454068EA7A2125B6CDBACA213D582607A5D2013',
              success: 'tesSUCCESS'
            },
            {
              _id: '7148B37BA0EF0CFB9A3EBE0290979A44E542F01BEAF816D683AC82408CE026FC',
              hashType: 2,
              index: 1,
              type: 'OfferCreate',
              account: 'ja2rF7o54ydxJgwa1Vnf5wmxf2c3UmnB6A',
              seq: 28988,
              fee: 0.00001,
              succ: 'tesSUCCESS',
              takerGets: {
                currency: 'JVEE',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '76.81644921999999'
              },
              takerPays: { currency: 'SWTC', issuer: '', value: '57364.65749' },
              platform: 'jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5',
              realGets: {
                currency: 'JVEE',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '76.81644921999999'
              },
              realPays: { currency: 'SWTC', issuer: '', value: '57364.65749' },
              flag: 2,
              hash: '7148B37BA0EF0CFB9A3EBE0290979A44E542F01BEAF816D683AC82408CE026FC',
              success: 'tesSUCCESS'
            }
          ],
          total: 2
        }
      });
    });
  });

  describe("test fetchBlockTransactionsByHash", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchBlockTransactionsByHash({
          uuid: "jGa9J9TkqtBc",
          blockHash: "68E38223CAF2677DA8FE15C61E12A1FC6AB6AF9FE53FC91D44BCA9CC59FEB428"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchBlockTransactionsByHash({
          uuid: "jGa9J9TkqtBc",
          blockHash: "68E38223CAF2677DA8FE15C61E12A1FC6AB6AF9FE53FC91D44BCA9CC59FEB428"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return block transactions", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        "data": {
          "list": [
            {
              "_id": "CF916A61979D702E8F41ADEF8B067476FC6F6BA505754F86D034EDA5E110475D",
              "hashType": 2,
              "index": 1,
              "type": "OfferCreate",
              "account": "jL7Q26qWtWxZtZUpdEq5KZbuJBXbyuiKpe",
              "seq": 1386168,
              "fee": 0.001,
              "succ": "tesSUCCESS",
              "takerGets": {
                "currency": "JUSDT",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "19.24"
              },
              "takerPays": {
                "currency": "JUNI",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "2"
              },
              "realGets": {
                "currency": "JUSDT",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "19.24"
              },
              "realPays": {
                "currency": "JUNI",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "2"
              },
              "flag": 1
            },
            {
              "_id": "D857B584C5A3F719B949F08E18DB4B41A209460C4442A19D4FF38A023E9BEF8B",
              "hashType": 2,
              "index": 2,
              "type": "Payment",
              "account": "jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4",
              "seq": 1,
              "fee": 0.01,
              "succ": "tesSUCCESS",
              "dest": "jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p",
              "amount": {
                "currency": "WUSDT",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "51.892851"
              }
            }
          ],
          "count": 1
        }
      });
      const res = await explorer.fetchBlockTransactionsByHash({
        uuid: "jGa9J9TkqtBc",
        blockHash: "68E38223CAF2677DA8FE15C61E12A1FC6AB6AF9FE53FC91D44BCA9CC59FEB428",
        size: explorer.pageSize.FIFTY
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/hash/trans/jGa9J9TkqtBc",
          params: {
            p: 0,
            s: 50,
            h: "68E38223CAF2677DA8FE15C61E12A1FC6AB6AF9FE53FC91D44BCA9CC59FEB428",
            n: 1
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          transactions: [
            {
              index: 1,
              type: 'OfferCreate',
              account: 'jL7Q26qWtWxZtZUpdEq5KZbuJBXbyuiKpe',
              seq: 1386168,
              fee: 0.001,
              takerGets: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '19.24'
              },
              takerPays: {
                currency: 'JUNI',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '2'
              },
              realGets: {
                currency: 'JUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '19.24'
              },
              realPays: {
                currency: 'JUNI',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '2'
              },
              flag: 1,
              hash: 'CF916A61979D702E8F41ADEF8B067476FC6F6BA505754F86D034EDA5E110475D',
              success: 'tesSUCCESS'
            },
            {
              index: 2,
              type: 'Payment',
              account: 'jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4',
              seq: 1,
              fee: 0.01,
              dest: 'jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p',
              amount: {
                currency: 'WUSDT',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
                value: '51.892851'
              },
              hash: 'D857B584C5A3F719B949F08E18DB4B41A209460C4442A19D4FF38A023E9BEF8B',
              success: 'tesSUCCESS'
            }
          ]
        }
      });
    });
  });

});
