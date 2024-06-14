import sinon from "sinon";
import JCCDexExplorer from "../src/explorer";
import { CloudError } from "../src/error";
import { NFTStatus, NftTransactionType, PageSize } from "../src/types";
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
              type: "OfferCreate",
              time: 100,
              hash: "A5FAED341A6292447F130056A68ACB2155AE0C37287D04CF12DD17CCE1C0AA2B",
              block: 28818929,
              fee: 0.001,
              success: "tesSUCCESS",
              seq: 1382376,
              takerGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "20.028"
              },
              takerPays: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
              },
              takerGetsFact: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "20.028"
              },
              takerPaysFact: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
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
              hash: "A5FAED341A6292447F130056A68ACB2155AE0C37287D04CF12DD17CCE1C0AA2B",
              block: 28818929,
              fee: 0.001,
              success: "tesSUCCESS",
              seq: 1382376,
              takerGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "20.028"
              },
              takerPays: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
              },
              takerGetsFact: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "20.028"
              },
              takerPaysFact: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
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
        data: {
          j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi: [
            {
              currency: "CNY",
              issuer: "jGwru5JHQ2y9iHqF4LwqWjrQinyBqoxzd5"
            },
            {
              currency: "EUR",
              issuer: "jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"
            },
            {
              currency: "8000000000000000000000007F92BA0351D9547B",
              issuer: "jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"
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
              currency: "CNY",
              issuer: "jGwru5JHQ2y9iHqF4LwqWjrQinyBqoxzd5"
            },
            {
              currency: "EUR",
              issuer: "jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"
            },
            {
              currency: "8000000000000000000000007F92BA0351D9547B",
              issuer: "jBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"
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
        data: {
          list: [
            {
              type: "Fee",
              block: 28809485,
              time: 100,
              currency: "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.0019904444765127",
              den: 1000,
              num: 2,
              platform: "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto",
              hash: "B8181A68686D8AFC276DDABD132C55760255D0096DCFC2AD81EC58E029421AF2"
            },
            {
              type: "Fee",
              block: 28809485,
              time: 200,
              currency: "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.0092025487034873",
              den: 1000,
              num: 2,
              platform: "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto",
              hash: "91DA75B6E07A2CF09C919A0B834000044A99F0840ACF1BFD0823FE59A8D186E3"
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
            t: "Fee"
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          fees: [
            {
              type: "Fee",
              block: 28809485,
              time: 100000 + timeOffset,
              currency: "JUSDT",
              value: "0.0019904444765127",
              den: 1000,
              num: 2,
              platform: "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto",
              hash: "B8181A68686D8AFC276DDABD132C55760255D0096DCFC2AD81EC58E029421AF2",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
            },
            {
              type: "Fee",
              block: 28809485,
              time: 200000 + timeOffset,
              currency: "JUSDT",
              value: "0.0092025487034873",
              den: 1000,
              num: 2,
              platform: "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto",
              hash: "91DA75B6E07A2CF09C919A0B834000044A99F0840ACF1BFD0823FE59A8D186E3",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
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
          blockNumber: 20545139
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchBlockTransactions({
          uuid: "jGa9J9TkqtBc",
          blockNumber: 20545139
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return transactions", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              _id: "3FBDAE6E57131B8E367270FA7524A11423C7B0E127DA789BE289CCDAD5A21CFD",
              upperHash: "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3",
              block: 28824756,
              time: 771413360,
              index: 0,
              type: "Payment",
              account: "jB6p3U47Faj8b21nzEoXsNjfBMsj9hGgth",
              seq: 2,
              fee: 0.01,
              succ: "tesSUCCESS",
              dest: "jHeqgUVFeDoiBcqeva2HCUSNk683UZfihP",
              amount: {
                currency: "WUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "50.94586808"
              }
            },
            {
              _id: "7401BAA50F0DA374DEC1F11FBFE06C30F03245BA04BB41687A813C49F51B92D0",
              upperHash: "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3",
              block: 28824756,
              time: 771413360,
              index: 2,
              type: "OfferCreate",
              account: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
              seq: 2150223,
              fee: 0.01,
              succ: "tesSUCCESS",
              takerGets: {
                currency: "CSP",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2280.01833525"
              },
              takerPays: {
                currency: "CCMOAC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "14.24939964"
              },
              platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
              affectedNodes: [
                {
                  account: "jBzGwUJtCm9cR8CKgfsSkMs647TB6eKC9D",
                  seq: 3634,
                  flags: 131072,
                  previous: {
                    takerGets: {
                      currency: "CCMOAC",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "29.45283332771408"
                    },
                    takerPays: {
                      currency: "CSP",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "4676.821263733587"
                    }
                  },
                  final: {
                    takerGets: {
                      currency: "CCMOAC",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "15.09414903652932"
                    },
                    takerPays: {
                      currency: "CSP",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "2396.802928483587"
                    }
                  },
                  brokerage: {
                    platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                    feeAccount: "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                    den: 1000,
                    num: 2,
                    currency: "CSP",
                    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                    value: "4.5600366705"
                  }
                }
              ],
              brokerage: {
                platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                feeAccount: "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                den: 1000,
                num: 2,
                currency: "CCMOAC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.02871736858236952"
              }
            },
            {
              _id: "90973C48858F00661E6908CA95653C25CE17BEB0D0C4888071B14B107DB0DBEA",
              upperHash: "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3",
              block: 28824756,
              time: 771413360,
              index: 3,
              type: "OfferCancel",
              account: "jJG5GYgs6LE1phryL4vVMPyTrf7px6LQXW",
              seq: 46970,
              fee: 0.00001,
              succ: "tesSUCCESS",
              offerSeq: 42032,
              takerGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.7028459598464"
              },
              takerPays: {
                currency: "JBTC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.000030003930519"
              }
            }
          ]
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
              type: "Payment",
              account: "jB6p3U47Faj8b21nzEoXsNjfBMsj9hGgth",
              seq: 2,
              fee: 0.01,
              succ: "tesSUCCESS",
              dest: "jHeqgUVFeDoiBcqeva2HCUSNk683UZfihP",
              amount: {
                currency: "WUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "50.94586808"
              },
              hash: "3FBDAE6E57131B8E367270FA7524A11423C7B0E127DA789BE289CCDAD5A21CFD",
              blockHash: "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3"
            },
            {
              block: 28824756,
              time: 1718098160000,
              index: 2,
              type: "OfferCreate",
              account: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
              seq: 2150223,
              fee: 0.01,
              succ: "tesSUCCESS",
              takerGets: {
                currency: "CSP",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2280.01833525"
              },
              takerPays: {
                currency: "CCMOAC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "14.24939964"
              },
              platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
              affectedNodes: [
                {
                  account: "jBzGwUJtCm9cR8CKgfsSkMs647TB6eKC9D",
                  seq: 3634,
                  flags: 131072,
                  previous: {
                    takerGets: {
                      currency: "CCMOAC",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "29.45283332771408"
                    },
                    takerPays: {
                      currency: "CSP",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "4676.821263733587"
                    }
                  },
                  final: {
                    takerGets: {
                      currency: "CCMOAC",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "15.09414903652932"
                    },
                    takerPays: {
                      currency: "CSP",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "2396.802928483587"
                    }
                  },
                  brokerage: {
                    platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                    feeAccount: "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                    den: 1000,
                    num: 2,
                    currency: "CSP",
                    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                    value: "4.5600366705"
                  }
                }
              ],
              brokerage: {
                platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                feeAccount: "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                den: 1000,
                num: 2,
                currency: "CCMOAC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.02871736858236952"
              },
              hash: "7401BAA50F0DA374DEC1F11FBFE06C30F03245BA04BB41687A813C49F51B92D0",
              blockHash: "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3"
            },
            {
              block: 28824756,
              time: 1718098160000,
              index: 3,
              type: "OfferCancel",
              account: "jJG5GYgs6LE1phryL4vVMPyTrf7px6LQXW",
              seq: 46970,
              fee: 0.00001,
              succ: "tesSUCCESS",
              offerSeq: 42032,
              takerGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.7028459598464"
              },
              takerPays: {
                currency: "JBTC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.000030003930519"
              },
              hash: "90973C48858F00661E6908CA95653C25CE17BEB0D0C4888071B14B107DB0DBEA",
              blockHash: "3ED3930160AD1FE7727B36CC8182E3647D9DCA3855157913B40F31E3EFE75BE3"
            }
          ]
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
        await explorer.fetchLatestSixBlocks({ uuid: "jGa9J9TkqtBc" });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(explorer.fetchLatestSixBlocks({ uuid: "jGa9J9TkqtBc" })).rejects.toThrow(
        new CloudError("-1", "error")
      );
    });

    test("should return blocks", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              _id: 28833309,
              hash: "787900085563AF65D568382A613C79A85D730456EF5F3CB52FF991062569AB93",
              parentHash: "5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA",
              time: 771498890,
              transNum: 7,
              past: 18
            },
            {
              _id: 28833308,
              hash: "5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA",
              parentHash: "839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8",
              time: 771498880,
              transNum: 13,
              past: 28
            },
            {
              _id: 28833307,
              hash: "839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8",
              parentHash: "95628DEF0BB90F62D49166B4F8B5B874AACF4AA1E65B914380E05E854C675723",
              time: 771498870,
              transNum: 0,
              past: 38
            }
          ]
        }
      });
      const res = await explorer.fetchLatestSixBlocks({ uuid: "jGa9J9TkqtBc" });

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
              hash: "787900085563AF65D568382A613C79A85D730456EF5F3CB52FF991062569AB93",
              parentHash: "5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA",
              time: 1718183690000,
              transNum: 7,
              past: 18000,
              block: 28833309
            },
            {
              hash: "5652451384C3BB7FC63EDA9796ED94DB77097CCAAC4B7138C404D88B5006C3DA",
              parentHash: "839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8",
              time: 1718183680000,
              transNum: 13,
              past: 28000,
              block: 28833308
            },
            {
              hash: "839F460F63F2A764779C987763C9CDB4F331743F6C0B0B821A7A5BD1F29C03F8",
              parentHash: "95628DEF0BB90F62D49166B4F8B5B874AACF4AA1E65B914380E05E854C675723",
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
        await explorer.fetchAllBlocks({ uuid: "jGa9J9TkqtBc" });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(explorer.fetchAllBlocks({ uuid: "jGa9J9TkqtBc" })).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return blocks", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              _id: 28833422,
              hash: "F4B2723148C739F54C5D72E03E487C74F25207CBA5E62216291E674FAAAB65DF",
              parentHash: "6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69",
              time: 771500020,
              transNum: 2,
              past: 14
            },
            {
              _id: 28833421,
              hash: "6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69",
              parentHash: "35FEA85D76089D757B86B2ABD7BDD71161206702C743621F738A6DC2A3682596",
              time: 771500010,
              transNum: 0,
              past: 24
            }
          ]
        }
      });
      const res = await explorer.fetchAllBlocks({ uuid: "jGa9J9TkqtBc" });

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
              hash: "F4B2723148C739F54C5D72E03E487C74F25207CBA5E62216291E674FAAAB65DF",
              parentHash: "6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69",
              time: 1718184820000,
              transNum: 2,
              past: 14000,
              block: 28833422
            },
            {
              hash: "6BF4913454833B441FEC9C6DA688A1294D4E195D294BFC3E16350D4F09153C69",
              parentHash: "35FEA85D76089D757B86B2ABD7BDD71161206702C743621F738A6DC2A3682596",
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

  describe("test fetchNftConfigs", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      await expect(explorer.fetchNftConfigs({ uuid: "jGa9J9TkqtBc" })).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return nft configs", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              FundCode: "4E46542054657374",
              Issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              Flags: 0,
              FundCodeName: "NFT Test",
              LedgerIndex: "AB0317A3CB84EAFEFD0241F0159FB75CDA4256EE7169A7936E6C200569F5F446",
              TokenIssued: "0000000000000000",
              TokenSize: "00000000000F4240",
              hash: "80D1F8CB54F005702463665E9F18A6162DE8A9813285B61AA651509F87141240",
              issuer_accountid: "jaFuLtKN63p2owVZ2qVcQXhZEKUqVBdYFZ",
              issuer_time: 706433800
            }
          ]
        }
      });

      const res = await explorer.fetchNftConfigs({
        uuid: "jGa9J9TkqtBc",
        fundCodeName: "NFT Test",
        issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/config/jGa9J9TkqtBc",
          params: {
            n: "NFT Test",
            w: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9"
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          nfts: [
            {
              fundCode: "4E46542054657374",
              issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              flags: 0,
              fundCodeName: "NFT Test",
              ledgerIndex: "AB0317A3CB84EAFEFD0241F0159FB75CDA4256EE7169A7936E6C200569F5F446",
              tokenIssued: "0000000000000000",
              tokenSize: "00000000000F4240",
              hash: "80D1F8CB54F005702463665E9F18A6162DE8A9813285B61AA651509F87141240",
              issuerAccountId: "jaFuLtKN63p2owVZ2qVcQXhZEKUqVBdYFZ",
              issuerTime: 1653118600000
            }
          ]
        }
      });
    });
  });

  describe("test fetchNftTokenInfo", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when parameters are invalid", async () => {
      await expect(
        explorer.fetchNftTokenInfo({
          uuid: "jGa9J9TkqtBc",
          page: -1
        })
      ).rejects.toThrow(new Error("Page is invalid"));

      await expect(
        explorer.fetchNftTokenInfo({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: -1 as PageSize
        })
      ).rejects.toThrow(new Error("Size is invalid"));

      await expect(
        explorer.fetchNftTokenInfo({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: 1000 as PageSize
        })
      ).rejects.toThrow(new Error("Size is invalid"));

      await expect(
        explorer.fetchNftTokenInfo({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: 100
        })
      ).rejects.toThrow(new Error('At least one parameter is required in "tokenId, address, issuer, fundCodeName"'));

      await expect(
        explorer.fetchNftTokenInfo({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: 100,
          tokenId: "123",
          valid: 2 as NFTStatus
        })
      ).rejects.toThrow(new Error('The value of "valid" is invalid'));
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      await expect(explorer.fetchNftTokenInfo({ uuid: "jGa9J9TkqtBc", issuer: "" })).rejects.toThrow(
        new CloudError("-1", "error")
      );
    });

    test("should return nft token info", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              TokenID: "64656E2053616E647320E98791E6B29900000000000000000000000000000066",
              Flags: 0,
              FundCode: "476F6C64656E2053616E647320E98791E6B299",
              FundCodeName: "Golden Sands 金沙",
              Issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              LedgerIndex: "517B2135F6785A9F6F8B7FE49D00C02B9B9577D933C5CFDF850DEFF9282D2DDF",
              LowNode: "0000000000000000",
              TokenInfos: [
                {
                  TokenInfo: {
                    InfoData:
                      "68747470733A2F2F6D6F61632E6D7970696E6174612E636C6F75642F697066732F516D5234764137515138746F54655134567562577351535462355876633675476F456E6D474B6B53527666664551",
                    InfoType: "746F6B656E557269"
                  }
                }
              ],
              TokenOwner: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              TokenSender: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              block: 22406375,
              hash: "B386152DA03ED2CD9ACC0B82CD46EFF1FC6F6D21A7FB5A28F0F514B1DE1197A2",
              index: 0,
              inservice: 0,
              issuer_time: 707227650,
              time: 707228270,
              type: "TokenDel"
            }
          ]
        }
      });

      const res = await explorer.fetchNftTokenInfo({
        uuid: "jGa9J9TkqtBc",
        issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/tokeninfo/jGa9J9TkqtBc",
          params: {
            k: undefined,
            w: undefined,
            p: 0,
            s: 20,
            i: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
            n: undefined,
            valid: undefined
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          nfts: [
            {
              tokenId: "64656E2053616E647320E98791E6B29900000000000000000000000000000066",
              type: "TokenDel",
              time: 1653913070000,
              hash: "B386152DA03ED2CD9ACC0B82CD46EFF1FC6F6D21A7FB5A28F0F514B1DE1197A2",
              block: 22406375,
              index: 0,
              flags: 0,
              fundCode: "476F6C64656E2053616E647320E98791E6B299",
              fundCodeName: "Golden Sands 金沙",
              issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              lowNode: "0000000000000000",
              tokenInfos: [
                {
                  TokenInfo: {
                    InfoData:
                      "68747470733A2F2F6D6F61632E6D7970696E6174612E636C6F75642F697066732F516D5234764137515138746F54655134567562577351535462355876633675476F456E6D474B6B53527666664551",
                    InfoType: "746F6B656E557269"
                  }
                }
              ],
              tokenOwner: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              tokenSender: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              ledgerIndex: "517B2135F6785A9F6F8B7FE49D00C02B9B9577D933C5CFDF850DEFF9282D2DDF",
              inservice: 0,
              issuerTime: 1653912450000
            }
          ]
        }
      });

      await explorer.fetchNftTokenInfo({
        uuid: "jGa9J9TkqtBc",
        tokenId: "1",
        address: "2",
        fundCodeName: "3",
        page: 2,
        size: 10,
        issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
        valid: 0
      });

      expect(
        stub.calledWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/tokeninfo/jGa9J9TkqtBc",
          params: {
            k: "1",
            w: "2",
            p: 2,
            s: 10,
            i: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
            n: "3",
            valid: 0
          }
        })
      ).toEqual(true);

      await explorer.fetchNftTokenInfo({
        uuid: "jGa9J9TkqtBc",
        tokenId: "1",
        address: "2",
        fundCodeName: "3",
        page: 2,
        size: 50,
        issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
        valid: 0
      });

      expect(
        stub.calledWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/tokeninfo/jGa9J9TkqtBc",
          params: {
            k: "1",
            w: "2",
            p: 2,
            s: 50,
            i: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
            n: "3",
            valid: 0
          }
        })
      ).toEqual(true);

      await explorer.fetchNftTokenInfo({
        uuid: "jGa9J9TkqtBc",
        tokenId: "1",
        address: "2",
        fundCodeName: "3",
        page: 2,
        size: 100,
        issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
        valid: 1
      });

      expect(
        stub.calledWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/tokeninfo/jGa9J9TkqtBc",
          params: {
            k: "1",
            w: "2",
            p: 2,
            s: 100,
            i: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
            n: "3",
            valid: 1
          }
        })
      ).toEqual(true);
    });
  });

  describe("test fetchNftTransfers", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when parameters are invalid", async () => {
      await expect(
        explorer.fetchNftTransfers({
          uuid: "jGa9J9TkqtBc",
          page: -1
        })
      ).rejects.toThrow(new Error("Page is invalid"));

      await expect(
        explorer.fetchNftTransfers({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: -1 as PageSize
        })
      ).rejects.toThrow(new Error("Size is invalid"));

      await expect(
        explorer.fetchNftTransfers({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: 1000 as PageSize
        })
      ).rejects.toThrow(new Error("Size is invalid"));

      await expect(
        explorer.fetchNftTransfers({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: 100
        })
      ).rejects.toThrow(new Error('At least one parameter is required in "tokenId, address"'));

      await expect(
        explorer.fetchNftTransfers({
          uuid: "jGa9J9TkqtBc",
          page: 1,
          size: 100,
          tokenId: "123",
          type: "" as NftTransactionType
        })
      ).rejects.toThrow(new Error('The value of "type" is invalid'));
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      await expect(explorer.fetchNftTransfers({ uuid: "jGa9J9TkqtBc", address: "" })).rejects.toThrow(
        new CloudError("-1", "error")
      );
    });

    test("should return nft token info", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              wallet: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
              type: "TransferToken",
              time: 707220080,
              hash: "2865D73808EBE2C7A067EBF7FA3C66D3D0A3EE81706AD6FD6B7BC5E96D7D90CB",
              block: 22405556,
              fee: 0.01,
              success: "tesSUCCESS",
              seq: 99651,
              offer: 0,
              index: 0,
              account: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              Flags: 0,
              TokenID: "64656E2053616E647320E98791E6B29900000000000000000000000000000066",
              FundCode: "476F6C64656E2053616E647320E98791E6B299",
              FundCodeName: "Golden Sands 金沙",
              Issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              LowNode: "0000000000000000",
              TokenInfos: [
                {
                  TokenInfo: {
                    InfoData:
                      "68747470733A2F2F6D6F61632E6D7970696E6174612E636C6F75642F697066732F516D5234764137515138746F54655134567562577351535462355876633675476F456E6D474B6B53527666664551",
                    InfoType: "746F6B656E557269"
                  }
                }
              ],
              TokenOwner: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              TokenSender: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
              LedgerEntryType: "ModifiedNode"
            }
          ],
          count: 1
        }
      });

      const res = await explorer.fetchNftTransfers({
        uuid: "jGa9J9TkqtBc",
        address: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/transfer/jGa9J9TkqtBc",
          params: {
            w: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
            k: undefined,
            p: 0,
            s: 20,
            t: undefined,
            b: undefined,
            e: undefined,
            aw: undefined
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          count: 1,
          transfers: [
            {
              wallet: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
              type: "TransferToken",
              time: 1653904880000,
              hash: "2865D73808EBE2C7A067EBF7FA3C66D3D0A3EE81706AD6FD6B7BC5E96D7D90CB",
              block: 22405556,
              fee: "0.01",
              success: "tesSUCCESS",
              seq: 99651,
              offer: 0,
              index: 0,
              tokenId: "64656E2053616E647320E98791E6B29900000000000000000000000000000066",
              flags: 0,
              fundCode: "476F6C64656E2053616E647320E98791E6B299",
              fundCodeName: "Golden Sands 金沙",
              issuer: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              lowNode: "0000000000000000",
              tokenInfos: [
                {
                  TokenInfo: {
                    InfoData:
                      "68747470733A2F2F6D6F61632E6D7970696E6174612E636C6F75642F697066732F516D5234764137515138746F54655134567562577351535462355876633675476F456E6D474B6B53527666664551",
                    InfoType: "746F6B656E557269"
                  }
                }
              ],
              tokenOwner: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
              tokenSender: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m"
            }
          ]
        }
      });

      await explorer.fetchNftTransfers({
        uuid: "jGa9J9TkqtBc",
        address: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
        tokenId: "1",
        page: 2,
        size: 10,
        type: NftTransactionType.TokenDel,
        beginTime: "2020-01-01",
        endTime: "2021-01-01",
        counterparty: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m"
      });

      expect(
        stub.calledWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/transfer/jGa9J9TkqtBc",
          params: {
            w: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
            k: "1",
            p: 2,
            s: 10,
            t: "TokenDel",
            b: "2020-01-01",
            e: "2021-01-01",
            aw: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m"
          }
        })
      ).toEqual(true);

      await explorer.fetchNftTransfers({
        uuid: "jGa9J9TkqtBc",
        address: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
        tokenId: "1",
        page: 2,
        size: 50,
        type: NftTransactionType.TokenIssue,
        beginTime: "2020-01-01",
        endTime: "2021-01-01",
        counterparty: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m"
      });

      expect(
        stub.calledWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/transfer/jGa9J9TkqtBc",
          params: {
            w: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9",
            k: "1",
            p: 2,
            s: 50,
            t: "TokenIssue",
            b: "2020-01-01",
            e: "2021-01-01",
            aw: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m"
          }
        })
      ).toEqual(true);

      await explorer.fetchNftTransfers({
        uuid: "jGa9J9TkqtBc",
        tokenId: "1",
        page: 2,
        size: 100,
        type: NftTransactionType.TransferToken,
        beginTime: "2020-01-01",
        endTime: "2021-01-01",
        counterparty: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m"
      });

      expect(
        stub.calledWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/transfer/jGa9J9TkqtBc",
          params: {
            w: undefined,
            k: "1",
            p: 2,
            s: 100,
            t: "TransferToken",
            b: "2020-01-01",
            e: "2021-01-01",
            aw: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m"
          }
        })
      ).toEqual(true);
    });
  });

  describe("test fetchNftsByIdOrName", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      await expect(explorer.fetchNftsByIdOrName({ uuid: "jGa9J9TkqtBc" })).rejects.toThrow(
        new CloudError("-1", "error")
      );
    });

    test("should return nft token info", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          token_name: ["Golden Sands 金沙_jaNBAS8PPENf178WwVynmunWo8dQGBjrh9"],
          token_id: ["64656E2053616E647320E98791E6B29900000000000000000000000000000066"]
        }
      });

      const res = await explorer.fetchNftsByIdOrName({
        uuid: "jGa9J9TkqtBc",
        tokenId: "1",
        tokenName: "2"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/all/jGa9J9TkqtBc",
          params: {
            k: "1",
            n: "2"
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          tokenIds: ["64656E2053616E647320E98791E6B29900000000000000000000000000000066"],
          tokenNames: [
            {
              name: "Golden Sands 金沙",
              holder: "jaNBAS8PPENf178WwVynmunWo8dQGBjrh9"
            }
          ]
        }
      });
    });
  });

  describe("test fetchIssuedNfts", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      await expect(explorer.fetchIssuedNfts({ uuid: "jGa9J9TkqtBc" })).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return nft token info", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              FundCode: "5445535432",
              Issuer: "jEnfwCyB1cvXH9T9WswtoqmKKcRZuyELvQ",
              Flags: 0,
              FundCodeName: "TEST2",
              count: 1,
              destory: 1,
              issueCount: 20,
              issueDate: 719031430,
              totalCount: 1000
            }
          ]
        }
      });

      const res = await explorer.fetchIssuedNfts({
        uuid: "jGa9J9TkqtBc"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/explorer/v1/nft/config/all/jGa9J9TkqtBc",
          params: {
            i: undefined,
            p: 0,
            s: 20
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          nfts: [
            {
              fundCode: "5445535432",
              issuer: "jEnfwCyB1cvXH9T9WswtoqmKKcRZuyELvQ",
              flags: 0,
              fundCodeName: "TEST2",
              count: 1,
              issueCount: 20,
              issueDate: 719031430,
              totalCount: 1000
            }
          ]
        }
      });
    });
  });
});
