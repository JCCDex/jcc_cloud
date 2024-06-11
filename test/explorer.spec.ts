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
        size: explorer.pageSize.Size10,
        buyOrSell: explorer.tradeType.All
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
        size: explorer.pageSize.Size50,
        type: explorer.orderType.OfferCreate,
        buyOrSell: explorer.tradeType.Buy
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
              type: explorer.orderType.OfferCreate,
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
              past: 103,
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
        size: explorer.pageSize.Size100,
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

});
