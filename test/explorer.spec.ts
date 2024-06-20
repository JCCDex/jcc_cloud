import sinon from "sinon";
import JCCDexExplorer from "../src/explorer";
import { CloudError } from "../src/error";
import { NFTStatus, NftTransactionType, PageSize } from "../src/types";
import { convertTime } from "../src/util";
const sandbox = sinon.createSandbox();

describe("test explorer", () => {
  const baseUrl = "https://swtcscan.jccdex.cn";
  const explorer = new JCCDexExplorer(baseUrl);
  const stub = sandbox.stub(explorer, "fetch");

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
              time: convertTime(100),
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
              time: convertTime(100),
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
              time: convertTime(100),
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
              time: convertTime(200),
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
          ],
          count: 3
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
            p: 0,
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
        await explorer.fetchLatestSixHash({ uuid: "jGa9J9TkqtBc" });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(explorer.fetchLatestSixHash({ uuid: "jGa9J9TkqtBc" })).rejects.toThrow(
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
              _id: "DD59FFB5A193ABF0690C858DFB61B4FA6B6B1BD9D40F3C2C3AED9E4FD69824FE",
              block: 28844593,
              time: 771611730,
              type: "OfferCreate",
              account: "jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv",
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.170728102562769"
              },
              takerPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.793827527104485"
              },
              realGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.170728102562769"
              },
              realPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.793827527104485"
              },
              past: 10
            },
            {
              _id: "E4107FEE38918287F572CDB688828FB79E68CF0C47ED1F9AB8D93660B48A35F1",
              block: 28844593,
              time: 771611730,
              type: "OfferCreate",
              account: "jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv",
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.123293942931793"
              },
              takerPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.303341491121857"
              },
              realGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.123293942931793"
              },
              realPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.303341491121857"
              },
              past: 10
            }
          ]
        }
      });
      const res = await explorer.fetchLatestSixHash({ uuid: "jGa9J9TkqtBc" });

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
              type: "OfferCreate",
              account: "jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv",
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.170728102562769"
              },
              takerPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.793827527104485"
              },
              realGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.170728102562769"
              },
              realPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.793827527104485"
              },
              past: 10000,
              hash: "DD59FFB5A193ABF0690C858DFB61B4FA6B6B1BD9D40F3C2C3AED9E4FD69824FE"
            },
            {
              block: 28844593,
              time: 1718296530000,
              type: "OfferCreate",
              account: "jQaznxC3dmKaHKDGVtasrqiL5mFtd5DTuv",
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.123293942931793"
              },
              takerPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.303341491121857"
              },
              realGets: {
                currency: "JMBOX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.123293942931793"
              },
              realPays: {
                currency: "JJST",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "1.303341491121857"
              },
              past: 10000,
              hash: "E4107FEE38918287F572CDB688828FB79E68CF0C47ED1F9AB8D93660B48A35F1"
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
        await explorer.fetchAllHash({ uuid: "jGa9J9TkqtBc" });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(explorer.fetchAllHash({ uuid: "jGa9J9TkqtBc" })).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return hashInfos", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              _id: "E6CF5244EB3E3C2BF433AE01F49CDC4609DBC6C0F46806A7B81780240E815817",
              block: 28844738,
              time: 771613180,
              type: "OfferCreate",
              account: "jBcHrPr3W1tzzLhqjTKXwo2zt4fpm3AaQp",
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.007165188"
              },
              takerPays: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.070677414"
              },
              affectedNodes: [
                {
                  account: "jaz2J561QDxdd5xkH6rrRtTDhL5ZTrdWm4",
                  seq: 37422,
                  flags: 0,
                  previous: {
                    takerGets: {
                      currency: "JUSDT",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "48.68861190148087"
                    },
                    takerPays: {
                      currency: "JUNI",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "4.93599066316716"
                    }
                  },
                  final: {
                    takerGets: {
                      currency: "JUSDT",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "48.61793448704887"
                    },
                    takerPays: {
                      currency: "JUNI",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "4.92882547516716"
                    }
                  },
                  brokerage: {
                    platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                    feeAccount: "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                    den: 1000,
                    num: 2,
                    currency: "JUNI",
                    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                    value: "0.000014330376"
                  }
                }
              ],
              past: 10,
              flag: 2
            }
          ],
          count: 1000000
        }
      });
      const res = await explorer.fetchAllHash({ uuid: "jGa9J9TkqtBc" });

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
              hash: "E6CF5244EB3E3C2BF433AE01F49CDC4609DBC6C0F46806A7B81780240E815817",
              block: 28844738,
              time: 1718297980000,
              type: "OfferCreate",
              account: "jBcHrPr3W1tzzLhqjTKXwo2zt4fpm3AaQp",
              success: "tesSUCCESS",
              takerGets: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.007165188"
              },
              takerPays: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0.070677414"
              },
              affectedNodes: [
                {
                  account: "jaz2J561QDxdd5xkH6rrRtTDhL5ZTrdWm4",
                  seq: 37422,
                  flags: 0,
                  previous: {
                    takerGets: {
                      currency: "JUSDT",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "48.68861190148087"
                    },
                    takerPays: {
                      currency: "JUNI",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "4.93599066316716"
                    }
                  },
                  final: {
                    takerGets: {
                      currency: "JUSDT",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "48.61793448704887"
                    },
                    takerPays: {
                      currency: "JUNI",
                      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                      value: "4.92882547516716"
                    }
                  },
                  brokerage: {
                    platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
                    feeAccount: "jEZHFAYMZMrYVrqetoK9b8HBv2NE1YjaZN",
                    den: 1000,
                    num: 2,
                    currency: "JUNI",
                    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                    value: "0.000014330376"
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
        data: {
          _id: "1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6",
          hashType: 2,
          upperHash: "E4E6FADB033CF401CF494B7D047B7FC00F273CDF7C156E94D17C688FBDC01704",
          block: 28842246,
          time: 771588260,
          type: "OfferCreate",
          account: "jB6GhwX8QX1NM3YpjAEwPKseHqkMWZKk8K",
          seq: 161612,
          fee: 0.00001,
          succ: "tesSUCCESS",
          memos: [
            {
              Memo: {
                MemoData: ""
              }
            }
          ],
          takerGets: {
            currency: "JETH",
            issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            value: "0.002506556601902"
          },
          takerPays: {
            currency: "JUNI",
            issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            value: "0.894973621484745"
          },
          platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
          realGets: {
            currency: "JETH",
            issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            value: "0.002506556601902"
          },
          realPays: {
            currency: "JUNI",
            issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            value: "0.894973621484745"
          },
          affectedNodes: [],
          past: 18929,
          flag: 1
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
            hash: "1BF9B91C65A43E21B04CD0FBC624BACE916CDC8A5B584DB0AA67F1E8131A42F6",
            blockHash: "E4E6FADB033CF401CF494B7D047B7FC00F273CDF7C156E94D17C688FBDC01704",
            block: 28842246,
            time: 1718273060000,
            type: "OfferCreate",
            account: "jB6GhwX8QX1NM3YpjAEwPKseHqkMWZKk8K",
            seq: 161612,
            fee: 0.00001,
            success: "tesSUCCESS",
            memos: [{ Memo: { MemoData: "" } }],
            takerGets: {
              currency: "JETH",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.002506556601902"
            },
            takerPays: {
              currency: "JUNI",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.894973621484745"
            },
            platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
            realGets: {
              currency: "JETH",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.002506556601902"
            },
            realPays: {
              currency: "JUNI",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.894973621484745"
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
        data: {
          info: {
            _id: "8D9DEB75B007DF54AB0B8E5FE3873C367EF3025B6566E5075DE9AA5C3520B794",
            hashType: 1,
            upperHash: "",
            block: 28842212,
            time: 771587920,
            transNum: 2,
            parentHash: "6385743AA703AAFD795D14FF787F985CDF27F58F87F5AC662D8283360426645F",
            totalCoins: "599999999999460713",
            past: 20651
          },
          list: [
            {
              _id: "3816D1F4F6EAAF145ABCC598E454068EA7A2125B6CDBACA213D582607A5D2013",
              hashType: 2,
              index: 0,
              type: "Payment",
              account: "jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p",
              seq: 29916,
              fee: 0.01,
              succ: "tesSUCCESS",
              dest: "jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4",
              amount: {
                currency: "WTRX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "444.8086"
              }
            },
            {
              _id: "7148B37BA0EF0CFB9A3EBE0290979A44E542F01BEAF816D683AC82408CE026FC",
              hashType: 2,
              index: 1,
              type: "OfferCreate",
              account: "ja2rF7o54ydxJgwa1Vnf5wmxf2c3UmnB6A",
              seq: 28988,
              fee: 0.00001,
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JVEE",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "76.81644921999999"
              },
              takerPays: {
                currency: "SWTC",
                issuer: "",
                value: "57364.65749"
              },
              platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
              realGets: {
                currency: "JVEE",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "76.81644921999999"
              },
              realPays: {
                currency: "SWTC",
                issuer: "",
                value: "57364.65749"
              },
              flag: 2
            }
          ],
          count: 2
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
            blockHash: "8D9DEB75B007DF54AB0B8E5FE3873C367EF3025B6566E5075DE9AA5C3520B794",
            block: 28842212,
            time: 1718272720000,
            past: 20651000,
            transNum: 2,
            parentHash: "",
            totalCoins: "599999999999460713"
          },
          blockDetails: [
            {
              _id: "3816D1F4F6EAAF145ABCC598E454068EA7A2125B6CDBACA213D582607A5D2013",
              hashType: 2,
              index: 0,
              type: "Payment",
              account: "jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p",
              seq: 29916,
              fee: 0.01,
              succ: "tesSUCCESS",
              dest: "jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4",
              amount: {
                currency: "WTRX",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "444.8086"
              },
              hash: "3816D1F4F6EAAF145ABCC598E454068EA7A2125B6CDBACA213D582607A5D2013",
              success: "tesSUCCESS"
            },
            {
              _id: "7148B37BA0EF0CFB9A3EBE0290979A44E542F01BEAF816D683AC82408CE026FC",
              hashType: 2,
              index: 1,
              type: "OfferCreate",
              account: "ja2rF7o54ydxJgwa1Vnf5wmxf2c3UmnB6A",
              seq: 28988,
              fee: 0.00001,
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JVEE",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "76.81644921999999"
              },
              takerPays: { currency: "SWTC", issuer: "", value: "57364.65749" },
              platform: "jHbpNVU8sqCmBR5UawKvCQMpEJfFhqUvJ5",
              realGets: {
                currency: "JVEE",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "76.81644921999999"
              },
              realPays: { currency: "SWTC", issuer: "", value: "57364.65749" },
              flag: 2,
              hash: "7148B37BA0EF0CFB9A3EBE0290979A44E542F01BEAF816D683AC82408CE026FC",
              success: "tesSUCCESS"
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
        data: {
          list: [
            {
              _id: "CF916A61979D702E8F41ADEF8B067476FC6F6BA505754F86D034EDA5E110475D",
              hashType: 2,
              index: 1,
              type: "OfferCreate",
              account: "jL7Q26qWtWxZtZUpdEq5KZbuJBXbyuiKpe",
              seq: 1386168,
              fee: 0.001,
              succ: "tesSUCCESS",
              takerGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "19.24"
              },
              takerPays: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
              },
              realGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "19.24"
              },
              realPays: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
              },
              flag: 1
            },
            {
              _id: "D857B584C5A3F719B949F08E18DB4B41A209460C4442A19D4FF38A023E9BEF8B",
              hashType: 2,
              index: 2,
              type: "Payment",
              account: "jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4",
              seq: 1,
              fee: 0.01,
              succ: "tesSUCCESS",
              dest: "jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p",
              amount: {
                currency: "WUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "51.892851"
              }
            }
          ],
          count: 1
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
              type: "OfferCreate",
              account: "jL7Q26qWtWxZtZUpdEq5KZbuJBXbyuiKpe",
              seq: 1386168,
              fee: 0.001,
              takerGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "19.24"
              },
              takerPays: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
              },
              realGets: {
                currency: "JUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "19.24"
              },
              realPays: {
                currency: "JUNI",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "2"
              },
              flag: 1,
              hash: "CF916A61979D702E8F41ADEF8B067476FC6F6BA505754F86D034EDA5E110475D",
              success: "tesSUCCESS"
            },
            {
              index: 2,
              type: "Payment",
              account: "jMTWocqPdqFbd5UHbD5aizUJ5YfxtcqhP4",
              seq: 1,
              fee: 0.01,
              dest: "jBEXYiEwFD7hEY1DtcWFjDVGqXCtPjzj2p",
              amount: {
                currency: "WUSDT",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "51.892851"
              },
              hash: "D857B584C5A3F719B949F08E18DB4B41A209460C4442A19D4FF38A023E9BEF8B",
              success: "tesSUCCESS"
            }
          ]
        }
      });
    });
  });

  describe("test fetchTokensInFo", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchTokensInfo({
          uuid: "jGa9J9TkqtBc"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchTokensInfo({
          uuid: "jGa9J9TkqtBc"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return tokens list", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              count: 3,
              isNative: 0,
              issueCount: "100.00000000000002",
              issueDate: 0,
              reserveCount: 0,
              destory: 400,
              token: "800000000000000000000000F46A84565A538DBA",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              holdnum: 3
            },
            {
              count: 1091,
              isNative: 0,
              issueCount: "50000000",
              issueDate: 619769010,
              reserveCount: 50000000,
              block: 28460228,
              index: 0,
              token: "BGT",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              holdnum: 1091
            },
            {
              count: 144,
              isNative: 0,
              issueCount: "8000000",
              issueDate: 583901360,
              reserveCount: 8000000,
              token: "BIC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              holdnum: 144
            }
          ],
          count: 266
        }
      });
      const res = await explorer.fetchTokensInfo({
        uuid: "jGa9J9TkqtBc",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/sum/tokenlist/jGa9J9TkqtBc",
          params: {
            p: 0,
            s: 20,
            issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            t: ""
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          tokens: [
            {
              isNative: 0,
              issueCount: "100.00000000000002",
              issueDate: 0,
              reserveCount: 0,
              destory: 400,
              token: "800000000000000000000000F46A84565A538DBA",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              holdnum: 3
            },
            {
              isNative: 0,
              issueCount: "50000000",
              issueDate: 1566453810000,
              reserveCount: 50000000,
              block: 28460228,
              index: 0,
              token: "BGT",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              holdnum: 1091
            },
            {
              isNative: 0,
              issueCount: "8000000",
              issueDate: 1530586160000,
              reserveCount: 8000000,
              token: "BIC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              holdnum: 144
            }
          ],
          total: 266
        }
      });
    });
  });

  describe("test fetchTokensCirculationInfo", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchTokensCirculationInfo({
          uuid: "jGa9J9TkqtBc",
          token: "usdt",
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchTokensCirculationInfo({
          uuid: "jGa9J9TkqtBc",
          token: "usdt",
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return token Circulation Info", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: [
          { tokens: "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or" },
          { holders: 10 },
          { totalsupply: 9999856 },
          { circulation: 8515505.437096 },
          [
            { address: "jhgSm1MoEW59XW4ACsfY6HrvTAT2V1nhto", time: 771859804, amount: "4768905.946396" },
            { address: "jsk45ksJZUB7durZrLt5e86Eu2gtiXNRN4", time: 771859804, amount: "1484494.562904" },
            { address: "j9z82uwmvZ7WUHRrfXWKuRCJiXHXXh9Js", time: 771859804, amount: "1159629.73632" },
            { address: "jndp9nGyrrzZxrAZKAhGYyaWLTmadkKuhW", time: 771859804, amount: "998916.43" },
            { address: "jse3Ph2DP7zRnBXAXvLduoWr6Fag2iqevH", time: 771859804, amount: "992954.75" },
            { address: "jBttJkCeeXPfiL7Wa7gGmC5EKCAYuK3qGS", time: 771859804, amount: "487209.03" },
            { address: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m", time: 771859804, amount: "7529.029997848919" },
            { address: "jhiVByeeXXtnZAM12niy135o8cjGodPX73", time: 771859804, amount: "5394.34570946168" },
            { address: "jP5g6SgvN1FvaWada1ckGBbMoX5NYg7Muz", time: 771859804, amount: "5189.175216809778" },
            { address: "jDwJG7YAZagVXmU1ZmXF2ugAmSh1jU83Us", time: 771859804, amount: "5025.057273560223" }
          ],
          { flag: 1 },
          { issueDate: 611295390 }
        ]
      });
      const res = await explorer.fetchTokensCirculationInfo({
        uuid: "jGa9J9TkqtBc",
        token: "jusdt",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        size: explorer.pageSize.TEN
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/sum/list/jGa9J9TkqtBc",
          params: {
            p: 0,
            s: 10,
            t: "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          tokenInfo: {
            token: "JUSDT",
            issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            holders: 10,
            totalsupply: 9999856,
            circulation: 8515505.437096,
            flag: 1,
            issueDate: 1557980190000,
            holdersList: [
              {
                address: "jhgSm1MoEW59XW4ACsfY6HrvTAT2V1nhto",
                amount: "4768905.946396",
                time: 1718544604000
              },
              {
                address: "jsk45ksJZUB7durZrLt5e86Eu2gtiXNRN4",
                amount: "1484494.562904",
                time: 1718544604000
              },
              {
                address: "j9z82uwmvZ7WUHRrfXWKuRCJiXHXXh9Js",
                amount: "1159629.73632",
                time: 1718544604000
              },
              {
                address: "jndp9nGyrrzZxrAZKAhGYyaWLTmadkKuhW",
                amount: "998916.43",
                time: 1718544604000
              },
              {
                address: "jse3Ph2DP7zRnBXAXvLduoWr6Fag2iqevH",
                amount: "992954.75",
                time: 1718544604000
              },
              {
                address: "jBttJkCeeXPfiL7Wa7gGmC5EKCAYuK3qGS",
                amount: "487209.03",
                time: 1718544604000
              },
              {
                address: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
                amount: "7529.029997848919",
                time: 1718544604000
              },
              {
                address: "jhiVByeeXXtnZAM12niy135o8cjGodPX73",
                amount: "5394.34570946168",
                time: 1718544604000
              },
              {
                address: "jP5g6SgvN1FvaWada1ckGBbMoX5NYg7Muz",
                amount: "5189.175216809778",
                time: 1718544604000
              },
              {
                address: "jDwJG7YAZagVXmU1ZmXF2ugAmSh1jU83Us",
                amount: "5025.057273560223",
                time: 1718544604000
              }
            ]
          }
        }
      });
    });
  });

  describe("test fetchTokensList", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchTokensList({
          uuid: "jGa9J9TkqtBc",
          keyword: "usdt"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchTokensList({
          uuid: "jGa9J9TkqtBc",
          keyword: "usdt"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return token list by keyword", async () => {
      stub.resolves({
        code: "0",
        msg: "成功",
        data: [
          "JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          "SUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          "TUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          "WUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        ]
      });
      const res = await explorer.fetchTokensList({
        uuid: "jGa9J9TkqtBc",
        keyword: "usdt"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/sum/all/jGa9J9TkqtBc",
          params: { t: "USDT" }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "成功",
        data: {
          type: 1,
          tokens: [
            { token: "JUSDT", issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or" },
            { token: "SUSDT", issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or" },
            { token: "TUSDT", issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or" },
            { token: "WUSDT", issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or" }
          ]
        }
      });
    });

    test("should return all token list when no keyword", async () => {
      stub.resolves({
        code: "0",
        msg: "成功",
        data: [
          {
            P: [
              "PVS_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "PBLW_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "PHT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "PC0001_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
            ]
          },
          {
            V: [
              "VCC_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "VIS_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              "VST_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
            ]
          }
        ]
      });
      const res = await explorer.fetchTokensList({
        uuid: "jGa9J9TkqtBc"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/sum/all/jGa9J9TkqtBc",
          params: { t: "" }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "成功",
        data: {
          type: 0,
          tokens: [
            {
              firstLetter: "P",
              list: [
                {
                  token: "PVS",
                  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                },
                {
                  token: "PBLW",
                  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                },
                {
                  token: "PHT",
                  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                },
                {
                  token: "PC0001",
                  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                }
              ]
            },
            {
              firstLetter: "V",
              list: [
                {
                  token: "VCC",
                  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                },
                {
                  token: "VIS",
                  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                },
                {
                  token: "VST",
                  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                }
              ]
            }
          ]
        }
      });
    });
  });

  describe("test fetchTokensTradeStatistic", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchTokensTradeStatistic({
          uuid: "jGa9J9TkqtBc"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchTokensTradeStatistic({
          uuid: "jGa9J9TkqtBc"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return statistic parts list", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: [
          { bTime: 764092800, type: 2, bBlock: 28092704, eBlock: 28101343, eTime: 764179200, transNum: 56543 },
          { bTime: 764179200, type: 2, bBlock: 28101344, eBlock: 28109983, eTime: 764265600, transNum: 45878 },
          { bTime: 764265600, type: 2, bBlock: 28109984, eBlock: 28118623, eTime: 764352000, transNum: 59179 }
        ]
      });
      const res = await explorer.fetchTokensTradeStatistic({
        uuid: "jGa9J9TkqtBc"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/sum/trans_num/jGa9J9TkqtBc",
          params: {}
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              bBlock: 28092704,
              bTime: 1710777600000,
              eBlock: 28101343,
              eTime: 1710864000000,
              transNum: 56543,
              type: 2
            },
            {
              bBlock: 28101344,
              bTime: 1710864000000,
              eBlock: 28109983,
              eTime: 1710950400000,
              transNum: 45878,
              type: 2
            },
            {
              bBlock: 28109984,
              bTime: 1710950400000,
              eBlock: 28118623,
              eTime: 1711036800000,
              transNum: 59179,
              type: 2
            }
          ]
        }
      });
    });
  });

  describe("test fetchNewUserStatistic", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await explorer.fetchNewUserStatistic({
          uuid: "jGa9J9TkqtBc"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        explorer.fetchNewUserStatistic({
          uuid: "jGa9J9TkqtBc"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return statistic parts list", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: [
          { bTime: 764092800, type: 2, eTime: 764179200, userNum: 20, total: 3739780 },
          { bTime: 764179200, type: 2, eTime: 764265600, userNum: 0, total: 3739780 }
        ]
      });
      const res = await explorer.fetchNewUserStatistic({
        uuid: "jGa9J9TkqtBc"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/sum/users_num/jGa9J9TkqtBc",
          params: {}
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              bTime: 1710777600000,
              eTime: 1710864000000,
              total: 3739780,
              userNum: 20,
              type: 2
            },
            {
              bTime: 1710864000000,
              eTime: 1710950400000,
              total: 3739780,
              userNum: 0,
              type: 2
            }
          ]
        }
      });
    });
  });

  describe("test fetchTokenBalanceStatistic", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });

      await expect(
        explorer.fetchTokenBalanceStatistic({
          uuid: "jGa9J9TkqtBc",
          token: "swt",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));

      await expect(
        explorer.fetchTokenBalanceStatistic({
          uuid: "jGa9J9TkqtBc",
          token: "swt",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
          page: 1,
          size: 1000 as PageSize
        })
      ).rejects.toThrow(new Error("Size is invalid"));

      await expect(
        explorer.fetchTokenBalanceStatistic({
          uuid: "jGa9J9TkqtBc",
          token: "swt",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
          page: -1
        })
      ).rejects.toThrow(new Error("Page is invalid"));

      await expect(
        explorer.fetchTokenBalanceStatistic({
          uuid: "jGa9J9TkqtBc",
          token: "",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow(new Error("Token is invalid"));

      await expect(
        explorer.fetchTokenBalanceStatistic({
          uuid: "jGa9J9TkqtBc",
          token: "SWT",
          address: ""
        })
      ).rejects.toThrow(new Error("Address is invalid"));
    });

    test("should return statistic list", async () => {
      stub.resolves({
        code: "0",
        data: [
          {
            SWTC: [
              { createdTime: 772128000, SWTC: { value: "6077782.517467", ownerCount: 296, seq: 2185233 } },
              { createdTime: 772041600, SWTC: { value: "6077798.557467", ownerCount: 220, seq: 2183629 } },
              { createdTime: 771955200, SWTC: { value: "6077848.607467", ownerCount: 594, seq: 2178624 } },
              { createdTime: 771868800, SWTC: { value: "6077921.117467", ownerCount: 270, seq: 2171373 } },
              { createdTime: 771782400, SWTC: { value: "6077967.487467", ownerCount: 277, seq: 2166736 } },
              { createdTime: 771696000, SWTC: { value: "6077989.287467", ownerCount: 166, seq: 2164556 } },
              { createdTime: 771609600, SWTC: { value: "6078024.417467", ownerCount: 287, seq: 2161043 } },
              { createdTime: 771523200, SWTC: { value: "6078050.857467", ownerCount: 164, seq: 2158399 } },
              { createdTime: 771436800, SWTC: { value: "6078086.707467", ownerCount: 223, seq: 2154814 } },
              { createdTime: 771350400, SWTC: { value: "6078117.827467", ownerCount: 527, seq: 2151702 } },
              { createdTime: 771264000, SWTC: { value: "6078166.667467", ownerCount: 281, seq: 2146818 } },
              { createdTime: 771177600, SWTC: { value: "6078189.157467", ownerCount: 135, seq: 2144569 } },
              { createdTime: 771091200, SWTC: { value: "6078234.297467", ownerCount: 466, seq: 2140055 } },
              { createdTime: 771004800, SWTC: { value: "6078295.287467", ownerCount: 200, seq: 2133956 } },
              { createdTime: 770918400, SWTC: { value: "6078307.037467", ownerCount: 112, seq: 2132781 } },
              { createdTime: 770832000, SWTC: { value: "6078338.207467", ownerCount: 550, seq: 2129664 } },
              { createdTime: 770745600, SWTC: { value: "6078384.647467", ownerCount: 288, seq: 2125020 } },
              { createdTime: 770659200, SWTC: { value: "6078413.347467", ownerCount: 90, seq: 2122150 } },
              { createdTime: 770572800, SWTC: { value: "6078455.057467", ownerCount: 442, seq: 2117979 } },
              { createdTime: 770486400, SWTC: { value: "6078477.107467", ownerCount: 334, seq: 2115774 } }
            ]
          }
        ],
        msg: ""
      });
      const res = await explorer.fetchTokenBalanceStatistic({
        uuid: "jGa9J9TkqtBc",
        address: "jMO2eYX5z4j8b2FVU4k4zvQfZzgY",
        token: "swt"
      });

      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://swtcscan.jccdex.cn",
          url: "/sum/profit/balance/jGa9J9TkqtBc",
          params: {
            w: "jMO2eYX5z4j8b2FVU4k4zvQfZzgY",
            t: "swt",
            p: 0,
            s: 20,
            b: undefined,
            e: undefined
          }
        })
      ).toEqual(true);

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          balances: [
            {
              date: "2024-06-20",
              value: "6077782.517467"
            },
            {
              date: "2024-06-19",
              value: "6077798.557467"
            },
            {
              date: "2024-06-18",
              value: "6077848.607467"
            },
            {
              date: "2024-06-17",
              value: "6077921.117467"
            },
            {
              date: "2024-06-16",
              value: "6077967.487467"
            },
            {
              date: "2024-06-15",
              value: "6077989.287467"
            },
            {
              date: "2024-06-14",
              value: "6078024.417467"
            },
            {
              date: "2024-06-13",
              value: "6078050.857467"
            },
            {
              date: "2024-06-12",
              value: "6078086.707467"
            },
            {
              date: "2024-06-11",
              value: "6078117.827467"
            },
            {
              date: "2024-06-10",
              value: "6078166.667467"
            },
            {
              date: "2024-06-09",
              value: "6078189.157467"
            },
            {
              date: "2024-06-08",
              value: "6078234.297467"
            },
            {
              date: "2024-06-07",
              value: "6078295.287467"
            },
            {
              date: "2024-06-06",
              value: "6078307.037467"
            },
            {
              date: "2024-06-05",
              value: "6078338.207467"
            },
            {
              date: "2024-06-04",
              value: "6078384.647467"
            },
            {
              date: "2024-06-03",
              value: "6078413.347467"
            },
            {
              date: "2024-06-02",
              value: "6078455.057467"
            },
            {
              date: "2024-06-01",
              value: "6078477.107467"
            }
          ]
        }
      });
    });

    test("should return statistic list", async () => {
      stub.resolves({
        code: "0",
        data: [
          {
            JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: [
              { createdTime: 772128000, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1610.430558312638" },
              { createdTime: 772041600, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1606.169046642324" },
              { createdTime: 771955200, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1585.193063176591" },
              { createdTime: 771868800, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1542.454595797282" },
              { createdTime: 771782400, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1518.288063528697" },
              { createdTime: 771696000, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1517.506715823822" },
              { createdTime: 771609600, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1502.779280686739" },
              { createdTime: 771523200, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1479.24934468004" },
              { createdTime: 771436800, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1465.159485836139" },
              { createdTime: 771350400, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1449.204219592905" },
              { createdTime: 771264000, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1449.005851372628" },
              { createdTime: 771177600, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1436.512186442034" },
              { createdTime: 771091200, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1418.086563214109" },
              { createdTime: 771004800, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1351.332986472478" },
              { createdTime: 770918400, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1344.649687277967" },
              { createdTime: 770832000, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1336.776486876738" },
              { createdTime: 770745600, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1269.337049428888" },
              { createdTime: 770659200, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1252.943147200277" },
              { createdTime: 770572800, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1233.048877496459" },
              { createdTime: 770486400, JUSDT_jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or: "1221.753962288614" }
            ]
          }
        ],
        msg: ""
      });
      const res = await explorer.fetchTokenBalanceStatistic({
        uuid: "jGa9J9TkqtBc",
        address: "jMO2eYX5z4j8b2FVU4k4zvQfZzgY",
        token: "JUSDT"
      });

      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          balances: [
            {
              date: "2024-06-20",
              value: "1610.430558312638"
            },
            {
              date: "2024-06-19",
              value: "1606.169046642324"
            },
            {
              date: "2024-06-18",
              value: "1585.193063176591"
            },
            {
              date: "2024-06-17",
              value: "1542.454595797282"
            },
            {
              date: "2024-06-16",
              value: "1518.288063528697"
            },
            {
              date: "2024-06-15",
              value: "1517.506715823822"
            },
            {
              date: "2024-06-14",
              value: "1502.779280686739"
            },
            {
              date: "2024-06-13",
              value: "1479.24934468004"
            },
            {
              date: "2024-06-12",
              value: "1465.159485836139"
            },
            {
              date: "2024-06-11",
              value: "1449.204219592905"
            },
            {
              date: "2024-06-10",
              value: "1449.005851372628"
            },
            {
              date: "2024-06-09",
              value: "1436.512186442034"
            },
            {
              date: "2024-06-08",
              value: "1418.086563214109"
            },
            {
              date: "2024-06-07",
              value: "1351.332986472478"
            },
            {
              date: "2024-06-06",
              value: "1344.649687277967"
            },
            {
              date: "2024-06-05",
              value: "1336.776486876738"
            },
            {
              date: "2024-06-04",
              value: "1269.337049428888"
            },
            {
              date: "2024-06-03",
              value: "1252.943147200277"
            },
            {
              date: "2024-06-02",
              value: "1233.048877496459"
            },
            {
              date: "2024-06-01",
              value: "1221.753962288614"
            }
          ]
        }
      });
    });
  });
});
