import sinon from "sinon";
import JCCDexTxPool from "../src/txpool";
import { CloudError } from "../src/error";
import { Wallet } from "@jccdex/jingtum-lib";
import { AbstractKeyPair } from "../src/types";
const { sm3 } = require("sm3.js");
const sandbox = sinon.createSandbox();

const jingtumWallet = new Wallet("jingtum");

class KeyPair extends AbstractKeyPair {
  public deriveAddress(publicKey: string): string {
    return jingtumWallet.wallet.KeyPair.deriveAddress(publicKey);
  }

  public deriveKeyPair(secret: string): { privateKey: string; publicKey: string } {
    return jingtumWallet.wallet.KeyPair.deriveKeyPair(secret);
  }

  public isValidSecret(secret: string): boolean {
    return jingtumWallet.isValidSecret(secret);
  }

  public signTx(data: unknown, privateKey: string): unknown {
    return jingtumWallet.sign(data, privateKey);
  }

  public sign(data: string, privateKey: string) {
    return jingtumWallet.wallet.KeyPair.sign(data, privateKey);
  }

  public isValidAddress(address: string): boolean {
    return jingtumWallet.isValidAddress(address);
  }

  public hash(message: string): string {
    return sm3().update(message).digest("hex");
  }
}

describe("test txpool", () => {
  const baseUrl = "https://whcztranscache.jccdex.cn:8443";

  const txpool = new JCCDexTxPool("sssss", new KeyPair(), null);

  const stub = sandbox.stub(txpool, "fetch");

  describe("test setBaseUrl", () => {
    test("should set baseUrl", () => {
      txpool.setBaseUrl(baseUrl);
      expect(txpool.getBaseUrl()).toEqual("https://whcztranscache.jccdex.cn:8443");
    });
  });

  describe("test getAddressPublicKey", () => {
    test("should throw error when secret is invalid", () => {
      try {
        txpool.getAddressPublicKey("");
      } catch (error) {
        expect(error.message).toEqual("Secret is invalid");
      }
    });

    test("should return address, signedAddress and publicKey", () => {
      // jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj
      const account = txpool.getAddressPublicKey("shUsHaWL8eBRx84cD7oMZ8sXi9VNF");
      const { address, signedAddress, publicKey } = account;
      expect(address).toEqual("jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj");
      expect(signedAddress).toEqual(
        "3044022034AA6D893105AF8B99A4E5B99297A4E7FAE178E5CB6813A506BBF163E194E88B022047914F701E87B7DC37594B8BF15B23E15A75F4C5BBA05CB4C729E4AF4181A9E8"
      );
      expect(publicKey).toEqual("031F1CE171C8DE5DA496089BF4AFB4C5C036880978EB245A50C30755CAAA626B67");
    });
  });

  describe("test getSeqsFromTxPool", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when when parameters are invalid", async () => {
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "",
          publicKey: "",
          signedAddr: "",
          fromChain: -1,
          count: 0
        })
      ).rejects.toThrow(new Error("PublicKey is invalid"));
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "",
          publicKey: "FJekfjke",
          signedAddr: "",
          fromChain: -1,
          count: 0
        })
      ).rejects.toThrow(new Error("SignedAddr is invalid"));
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "",
          publicKey: "FJekfjke",
          signedAddr: "FJekfjke",
          fromChain: -1,
          count: 0
        })
      ).rejects.toThrow(new Error("FromChain is invalid"));
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "",
          publicKey: "FJekfjke",
          signedAddr: "FJekfjke",
          fromChain: 0,
          count: 0
        })
      ).rejects.toThrow(new Error("Count is invalid"));
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await txpool.getSeqsFromTxPool({
          uuid: "jGa9J9TkqtBc",
          publicKey: "jf2k2lj3jfl3j3i2i34oiiogj4ji",
          signedAddr: "lkjkdrjiorj322jlkj33l",
          fromChain: 0,
          count: 3
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "jGa9J9TkqtBc",
          publicKey: "jf2k2lj3jfl3j3i2i34oiiogj4ji",
          signedAddr: "lkjkdrjiorj322jlkj33l",
          fromChain: 0,
          count: 3
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return Seqs list", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: ["1", "2", "3"]
      });
      const res = await txpool.getSeqsFromTxPool({
        uuid: "jGa9J9TkqtBc",
        publicKey: "jf2k2lj3jfl3j3i2i34oiiogj4ji",
        signedAddr: "lkjkdrjiorj322jlkj33l",
        fromChain: 0,
        count: 3
      });
      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://whcztranscache.jccdex.cn:8443",
          url: "/tran/api/sequences/jf2k2lj3jfl3j3i2i34oiiogj4ji",
          params: {
            signedAddr: "lkjkdrjiorj322jlkj33l",
            fromChain: 0,
            count: 3
          }
        })
      ).toEqual(true);
      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          seqs: ["1", "2", "3"]
        }
      });
    });
  });

  describe("test batchSignWithSeqs", () => {
    test("should throw error when TxList is invalid", async () => {
      try {
        await txpool.batchSignWithSeqs({ txList: [], seqs: [], secret: "" });
      } catch (error) {
        expect(error.message).toEqual("TxList is invalid");
      }
      try {
        await txpool.batchSignWithSeqs({
          txList: [
            {
              Account: "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj",
              Fee: 10 / 1000000,
              Flags: 0,
              OfferSequence: 22976,
              TransactionType: "12345" // if TransactionType is invalid should throw error
            }
          ],
          seqs: [123],
          secret: "lsfjkjekslf"
        });
      } catch (error) {
        expect(error.message).toEqual("TxList is invalid");
      }
    });
    test("should throw error when seqs list is invalid", async () => {
      try {
        await txpool.batchSignWithSeqs({
          txList: [
            {
              Account: "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj",
              Fee: 10 / 1000000,
              Flags: 0,
              OfferSequence: 22976,
              TransactionType: "OfferCancel"
            }
          ],
          seqs: [],
          secret: ""
        });
      } catch (error) {
        expect(error.message).toEqual("Seqs list is invalid");
      }
    });
    test("should throw error when seqs amount is not to be equal to txList amount", async () => {
      try {
        await txpool.batchSignWithSeqs({
          txList: [
            {
              Account: "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj",
              Fee: 10 / 1000000,
              Flags: 0,
              OfferSequence: 22976,
              TransactionType: "OfferCancel"
            }
          ],
          seqs: [123, 124],
          secret: ""
        });
      } catch (error) {
        expect(error.message).toEqual("Seqs quantity is not equal to tx quantity");
      }
    });
    test("should throw error when secret is empty", async () => {
      try {
        await txpool.batchSignWithSeqs({
          txList: [
            {
              Account: "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj",
              Amount: "1",
              Destination: "jGVTKPD7xxQhzG9C3DMyKW9x8mNz4PjSoe",
              Fee: 10 / 1000000,
              Flags: 0,
              Memos: [
                {
                  Memo: {
                    MemoData: "测试转账",
                    MemoType: "string"
                  }
                }
              ],
              TransactionType: "Payment"
            }
          ],
          seqs: [123],
          secret: ""
        });
      } catch (error) {
        expect(error.message).toEqual("Secret is invalid");
      }
    });
    test("should throw error when secret is invalid", async () => {
      try {
        await txpool.batchSignWithSeqs({
          txList: [
            {
              Account: "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj",
              Amount: "1",
              Destination: "jGVTKPD7xxQhzG9C3DMyKW9x8mNz4PjSoe",
              Fee: 10 / 1000000,
              Flags: 0,
              Memos: [
                {
                  Memo: {
                    MemoData: "测试转账",
                    MemoType: "string"
                  }
                }
              ],
              TransactionType: "Payment"
            }
          ],
          seqs: [123],
          secret: "fjeslfjkrirgrlew3"
        });
      } catch (error) {
        expect(error.message).toEqual("Secret is invalid");
      }
    });

    test("should return dataHashSign, dataJsonStr", async () => {
      // test-address: jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj
      // secret: shUsHaWL8eBRx84cD7oMZ8sXi9VNF
      const { serializeCreateOrder, serializeCancelOrder, serializePayment } = require("@jccdex/jingtum-lib");

      const txOfferCancel = serializeCancelOrder(
        "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj", // address
        123, // offer sequence
        10 // fee
      );
      const txPayment = serializePayment(
        "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj", // address
        "1", // amount
        "jKM2cnK62BuKwvUcKkZqza5giutdpunPkQ", // to
        "swt", // token
        "testPay", // memo
        10, // fee
        "SWT", // nativeCurrency
        "" // platform
      );
      const txOfferCreate = serializeCreateOrder(
        "jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj", // address
        "0.1", // amount
        "moac", // base
        "swt", // counter
        "53", // sum
        "buy", // type
        "", // platform
        "swt", // nativeCurrency
        10, // fee
        "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or" // issuer
      );
      // 三种交易批量签名
      const res = await txpool.batchSignWithSeqs({
        txList: [txOfferCancel, txPayment, txOfferCreate],
        seqs: [123, 124, 125],
        secret: "shUsHaWL8eBRx84cD7oMZ8sXi9VNF"
      });

      expect(res.dataHashSign).toEqual(
        "3044022040028A3C463E3F69E0BB9C3EC6AD4B2E23456D0FA158ACB9C33B63A911BE79B102206009DFB810E42B14FFE840576F432433D9DC5423F0318649BB0E6B836099F7B1"
      );
      expect(res.dataJsonStr).toEqual(
        '[{"txSign":"1200082200000000240000007B20190000007B68400000000000000A7321031F1CE171C8DE5DA496089BF4AFB4C5C036880978EB245A50C30755CAAA626B6774473045022100F2743880F8E2E4FAED403093283F8561451AD07993D214AF7ECB6BA957A9BC4602203A2FA2C65396691FDE4FF32DC818A753CDE570BFCD8E191E717B6B95DA32A2B2811424599D1E2A7AA494BABDEBEC200ACDB82643B1ED","txHash":"0C9148613117405E6C797C6120F21203ACDDD94A0DF0C74E7542A20BC7A2EEFE","txAddr":"jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj","txSeq":123},{"txSign":"1200002200000000240000007C6140000000000F424068400000000000000A7321031F1CE171C8DE5DA496089BF4AFB4C5C036880978EB245A50C30755CAAA626B6774473045022100FD976ED58EA4BD5E2ADAE2D4CF595CEE7CD6751B37B88D21911249526C2E86010220062BE960DFE8C1D3EEF69C442C0FAF62378226C5470CE373FCFAE57F4907F1F1811424599D1E2A7AA494BABDEBEC200ACDB82643B1ED8314C956A29A001597339EFF415CE26DF21A89506BAAF9EA7C06737472696E677D0774657374506179E1F1","txHash":"B67BB380B6D5F6CA531F34C51AEBCF7C5F1B112FD7721FED26B5BC46CB2E0F48","txAddr":"jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj","txSeq":124},{"txSign":"1200072200000000240000007D64D4438D7EA4C6800000000000000000000000004D4F41430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159665400000000328B74068400000000000000A7321031F1CE171C8DE5DA496089BF4AFB4C5C036880978EB245A50C30755CAAA626B67744630440220192DC8730CC3F991BB6223AD1F314FDD3C5346AC9E750B7F98A2EDF5EEF27DA40220628B26A168BC46F18892C1CB0B1003ABA0CBEF22FA24A37FAB9FDC0DF4308375811424599D1E2A7AA494BABDEBEC200ACDB82643B1ED8D14896E3F7353697ECE52645D9C502F08BB2EDC5717","txHash":"0880CCCE14D0645FB1A18AB40063B7D5C31668BF178C2C039142B192796988E6","txAddr":"jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj","txSeq":125}]'
      );
    });
  });

  describe("test submitToTxPool", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when when parameters are invalid", async () => {
      await expect(
        txpool.submitToTxPool({
          uuid: "",
          publicKey: "",
          submitPara: { dataHashSign: "FJekfjke", dataJsonStr: "FJekfjke" }
        })
      ).rejects.toThrow(new Error("PublicKey is invalid"));
      await expect(
        txpool.submitToTxPool({
          uuid: "",
          publicKey: "FJekfjke",
          submitPara: { dataHashSign: "", dataJsonStr: "FJekfjke" }
        })
      ).rejects.toThrow(new Error("DataHashSign is invalid"));
      await expect(
        txpool.submitToTxPool({
          uuid: "",
          publicKey: "FJekfjke",
          submitPara: { dataHashSign: "FJekfjke", dataJsonStr: "" }
        })
      ).rejects.toThrow(new Error("DataJsonStr is invalid"));
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await txpool.submitToTxPool({
          uuid: "jGa9J9TkqtBc",
          publicKey: "jf2k2lj3jfl3j3i2i34oiiogj4ji",
          submitPara: { dataHashSign: "FJekfjke", dataJsonStr: "FJekfjke" }
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        txpool.submitToTxPool({
          uuid: "jGa9J9TkqtBc",
          publicKey: "jf2k2lj3jfl3j3i2i34oiiogj4ji",
          submitPara: { dataHashSign: "FJekfjke", dataJsonStr: "FJekfjke" }
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return Seqs list", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: true
      });
      const submitPara = { dataHashSign: "FJekfjke", dataJsonStr: "FJekfjke" };
      const res = await txpool.submitToTxPool({
        uuid: "jGa9J9TkqtBc",
        publicKey: "jf2k2lj3jfl3j3i2i34oiiogj4ji",
        submitPara
      });
      expect(
        stub.calledOnceWithExactly({
          method: "post",
          baseURL: "https://whcztranscache.jccdex.cn:8443",
          url: "/tran/api/submit/jf2k2lj3jfl3j3i2i34oiiogj4ji",
          data: submitPara
        })
      ).toEqual(true);
      expect(res).toEqual({
        code: "0",
        msg: "",
        data: { success: true }
      });
    });
  });

  describe("test fetchSubmittedData", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when when parameters are invalid", async () => {
      await expect(
        txpool.fetchSubmittedData({
          uuid: "",
          publicKey: "",
          state: 1,
          count: "one"
        })
      ).rejects.toThrow(new Error("PublicKey is invalid"));
      await expect(
        txpool.fetchSubmittedData({
          uuid: "",
          publicKey: "jf2k2lj3jfl",
          state: 0,
          count: "all"
        })
      ).rejects.toThrow(new Error("State is invalid"));
      await expect(
        txpool.fetchSubmittedData({
          uuid: "",
          publicKey: "jf2k2lj3jfl",
          state: 1,
          count: "fsef"
        })
      ).rejects.toThrow(new Error("Count is invalid"));
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await txpool.fetchSubmittedData({
          uuid: "",
          publicKey: "eiofjel",
          state: 2,
          count: "one"
        });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(
        txpool.fetchSubmittedData({
          uuid: "",
          publicKey: "eiofjel",
          state: 2,
          count: "one"
        })
      ).rejects.toThrow(new CloudError("-1", "error"));
    });

    test("should return submitted list", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: [
          {
            id: 1287505,
            txSign:
              "120000220000000024000000016140000000000F424068400000000000000A732103849B0B157524338925E059E7BACCD21576EDD26B2D6A87B7DF62DF288CC2542B7446304402204D2AA9CE8EC23059CF9DAA6012F85C52D9F8B31A4F8A252F3D584F73BF5C24DF022019DD2DDFC2B9445A7B17F095B960307B23C3BE7DCA7AA40750BE0DB90F934CF48114A3702051BFCF82721B401535B50F836BAA1DE88E8314A9EB80810D2F89F54A4E72AF7B877274BCDC337DF9EA7C06737472696E677D0DE6B58BE8AF95E8BDACE8B4A631E1F1",
            txHash: "26AEEDFA2364FB90BB81E010CBE45D2DB8B0FD5FCECD90AAD4204AE30D9D8D34",
            submitCount: 0,
            checkCount: 0,
            txState: 1,
            txAddr: "jEuBTAKkGndtoPEnhHu1gRFes6sYN9yCoS",
            txSeq: 1,
            createAt: "2024-07-09 14:42:05",
            updateAt: "2024-07-09 14:42:05"
          },
          {
            id: 1287506,
            txSign:
              "120000220000000024000000026140000000001E848068400000000000000A732103849B0B157524338925E059E7BACCD21576EDD26B2D6A87B7DF62DF288CC2542B7446304402204AE9C85D6ADD18B01FF1C0F1C5C5B8E3EA7FECB19090561EF79D61FC0F530D2702202DD1805B957A2B78F85B5B4B1DAE11416865BE1C0B4FE7DDC0AE8671E4DE5B288114A3702051BFCF82721B401535B50F836BAA1DE88E8314A9EB80810D2F89F54A4E72AF7B877274BCDC337DF9EA7C06737472696E677D0DE6B58BE8AF95E8BDACE8B4A632E1F1",
            txHash: "E485E437D382073096A3BF6D39640A0CEB085B4E7BA37AD42DAB81A88865FBE4",
            submitCount: 0,
            checkCount: 0,
            txState: 1,
            txAddr: "jEuBTAKkGndtoPEnhHu1gRFes6sYN9yCoS",
            txSeq: 2,
            createAt: "2024-07-09 14:42:05",
            updateAt: "2024-07-09 14:42:05"
          }
        ]
      });
      const options = { uuid: "", publicKey: "eiofjel", state: 1, count: "total" };
      const res = await txpool.fetchSubmittedData(options);
      expect(
        stub.calledOnceWithExactly({
          method: "get",
          baseURL: "https://whcztranscache.jccdex.cn:8443",
          url: "/tran/api/submitted/eiofjel",
          params: {
            state: options.state,
            count: options.count
          }
        })
      ).toEqual(true);
      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          list: [
            {
              id: 1287505,
              txSign:
                "120000220000000024000000016140000000000F424068400000000000000A732103849B0B157524338925E059E7BACCD21576EDD26B2D6A87B7DF62DF288CC2542B7446304402204D2AA9CE8EC23059CF9DAA6012F85C52D9F8B31A4F8A252F3D584F73BF5C24DF022019DD2DDFC2B9445A7B17F095B960307B23C3BE7DCA7AA40750BE0DB90F934CF48114A3702051BFCF82721B401535B50F836BAA1DE88E8314A9EB80810D2F89F54A4E72AF7B877274BCDC337DF9EA7C06737472696E677D0DE6B58BE8AF95E8BDACE8B4A631E1F1",
              txHash: "26AEEDFA2364FB90BB81E010CBE45D2DB8B0FD5FCECD90AAD4204AE30D9D8D34",
              submitCount: 0,
              checkCount: 0,
              txState: 1,
              txAddr: "jEuBTAKkGndtoPEnhHu1gRFes6sYN9yCoS",
              txSeq: 1,
              createAt: "2024-07-09 14:42:05",
              updateAt: "2024-07-09 14:42:05"
            },
            {
              id: 1287506,
              txSign:
                "120000220000000024000000026140000000001E848068400000000000000A732103849B0B157524338925E059E7BACCD21576EDD26B2D6A87B7DF62DF288CC2542B7446304402204AE9C85D6ADD18B01FF1C0F1C5C5B8E3EA7FECB19090561EF79D61FC0F530D2702202DD1805B957A2B78F85B5B4B1DAE11416865BE1C0B4FE7DDC0AE8671E4DE5B288114A3702051BFCF82721B401535B50F836BAA1DE88E8314A9EB80810D2F89F54A4E72AF7B877274BCDC337DF9EA7C06737472696E677D0DE6B58BE8AF95E8BDACE8B4A632E1F1",
              txHash: "E485E437D382073096A3BF6D39640A0CEB085B4E7BA37AD42DAB81A88865FBE4",
              submitCount: 0,
              checkCount: 0,
              txState: 1,
              txAddr: "jEuBTAKkGndtoPEnhHu1gRFes6sYN9yCoS",
              txSeq: 2,
              createAt: "2024-07-09 14:42:05",
              updateAt: "2024-07-09 14:42:05"
            }
          ]
        }
      });
    });
  });

  describe("test cancelSubmitChain", () => {
    afterEach(() => {
      sandbox.reset();
    });

    test("should throw error when when parameters are invalid", async () => {
      await expect(txpool.cancelSubmitChain({ uuid: "", publicKey: "", signedAddr: "sfsf" })).rejects.toThrow(
        new Error("PublicKey is invalid")
      );
      await expect(txpool.cancelSubmitChain({ uuid: "", publicKey: "eiofjel", signedAddr: "" })).rejects.toThrow(
        new Error("SignedAddr is invalid")
      );
    });

    test("should throw error when response is not success", async () => {
      stub.resolves({
        code: "-1",
        msg: "error"
      });
      try {
        await txpool.cancelSubmitChain({ uuid: "", publicKey: "eiofjel", signedAddr: "sfsf" });
      } catch (error) {
        expect(error instanceof CloudError).toEqual(true);
        expect(error.code).toEqual("-1");
        expect(error.message).toEqual("error");
      }
      await expect(txpool.cancelSubmitChain({ uuid: "", publicKey: "eiofjel", signedAddr: "sfsf" })).rejects.toThrow(
        new CloudError("-1", "error")
      );
    });

    test("should return submitted list", async () => {
      stub.resolves({
        code: "0",
        msg: "",
        data: true
      });
      const options = { uuid: "", publicKey: "eiofjel", signedAddr: "sfsf" };
      const res = await txpool.cancelSubmitChain(options);
      expect(
        stub.calledOnceWithExactly({
          method: "post",
          baseURL: "https://whcztranscache.jccdex.cn:8443",
          url: "/tran/api/cancel/eiofjel",
          params: {
            signedAddr: options.signedAddr
          }
        })
      ).toEqual(true);
      expect(res).toEqual({
        code: "0",
        msg: "",
        data: {
          canceled: true
        }
      });
    });
  });
});
