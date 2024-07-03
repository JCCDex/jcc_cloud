import sinon from "sinon";
import JCCDexTxPool from "../src/txpool";
import { CloudError } from "../src/error";
// import { } from "../src/txpoolTypes";
// import { convertTime } from "../src/util";
const sandbox = sinon.createSandbox();

describe("test txpool", () => {
  const baseUrl = "https://whcztranscache.jccdex.cn:8443";
  const txpool = new JCCDexTxPool("sssss");
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
      const {address, signedAddress, publicKey} = account;
      expect(address).toEqual("jhKUg4uyE1f4H3BZbWQ5HXCh99ChZSdpPj");
      expect(signedAddress).toEqual("3044022034AA6D893105AF8B99A4E5B99297A4E7FAE178E5CB6813A506BBF163E194E88B022047914F701E87B7DC37594B8BF15B23E15A75F4C5BBA05CB4C729E4AF4181A9E8");
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
          uuid: "", publicKey: "", signedAddr: "", fromChain: -1, count: 0
        })
      ).rejects.toThrow(new Error("PublicKey is invalid"));
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "", publicKey: "FJekfjke", signedAddr: "", fromChain: -1, count: 0
        })
      ).rejects.toThrow(new Error("SignedAddr is invalid"));
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "", publicKey: "FJekfjke", signedAddr: "FJekfjke", fromChain: -1, count: 0
        })
      ).rejects.toThrow(new Error("FromChain is invalid"));
      await expect(
        txpool.getSeqsFromTxPool({
          uuid: "", publicKey: "FJekfjke", signedAddr: "FJekfjke", fromChain: 0, count: 0
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
          seqs: [ "1", "2", "3" ]
        }
      });
    });
  });

});