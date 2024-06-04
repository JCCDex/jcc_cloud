import sinon from "sinon";
import JCCDexExplorer from "../src/explorer";
const fetch = require("../src/fetch");
const sandbox = sinon.createSandbox();

describe("test explorer", () => {
  const baseUrl = "https://swtcscan.jccdex.cn";
  const explorer = new JCCDexExplorer(baseUrl);
  const stub = sandbox.stub(fetch, "default");

  describe("test fetchBalances", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      await expect(
        explorer.fetchBalances({
          uuid: "jGa9J9TkqtBc",
          address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
        })
      ).rejects.toThrow("error");
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
});
