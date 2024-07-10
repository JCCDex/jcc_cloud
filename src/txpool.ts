import { CloudError } from "./error";
import { defaultFetch } from "./fetch";
import {
  isValidString,
  isValidFromChain,
  isValidCount,
  isValideSeqs,
  isValidTxList,
  isValidQueryState,
  isValidQueryType,
  funcBytesToHex
} from "./util";
import {
  IAccount,
  IFetchSeqsOptions,
  IFetchSeqsResponse,
  IBatchSignData,
  ITxPoolData,
  ISubmitOptions,
  ISubmitResponse,
  IFetchSubmittedOptions,
  IFetchSubmittedResponse,
  ISubmittedData,
  QueryState,
  QueryType,
  ICancelSubmitOptions,
  ICancelSubmitResponse
} from "./txpoolTypes";
const assert = require("assert");

export default class JCCDexTxPool {

  public fetch;

  private baseUrl: string;

  public queryState = QueryState;

  public queryType = QueryType;

  private wallet;

  private sm3;

  constructor(baseUrl: string, wallet: unknown, sm3: unknown, customFetch?: unknown) {
    this.baseUrl = baseUrl;
    this.fetch = customFetch || defaultFetch;
    this.wallet = wallet;
    this.sm3 = sm3;
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setWallet(wallet: unknown) {
    this.wallet = wallet;
  }

  public getWallet(): unknown {
    return this.wallet;
  }

  public setSm3(sm3: unknown) {
    this.sm3 = sm3;
  }

  public getSm3(): unknown {
    return this.sm3;
  }

  private isSuccess(code): boolean {
    return code === "0" || code === 0;
  }

  /**
   * get address、signedAddress and publicKey from secret
   * @param secret
   * @returns {address signedAddress publicKey}
   */
  public getAddressPublicKey(secret: string): IAccount {
    assert(isValidString(secret), "Secret is invalid");
    assert(this.wallet.isValidSecret(secret), "Secret is invalid");

    const KeyPair = this.wallet.wallet.KeyPair;
    const kp = KeyPair.deriveKeyPair(secret);
    const privateKey = kp.privateKey;
    const publicKey = kp.publicKey;
    const address = KeyPair.deriveAddress(publicKey);
    const signedAddress = KeyPair.sign(funcBytesToHex(Buffer.from(address)), privateKey);
    return { address, signedAddress, publicKey };
  }

/**
 * get Seqs from txpool service
 * @param options {
 *    publicKey 公钥
 *    signedAddr 对地址字符串签名后的内容
 *    fromChain 0-表示不从链上获取 1-表示从链上获取序列号
 *    count 表示获取多少个序列号
 * }
 * @returns {IFetchSeqsResponse}
 */
  public async getSeqsFromTxPool(options: IFetchSeqsOptions): Promise<IFetchSeqsResponse> {
    assert(isValidString(options.publicKey), "PublicKey is invalid");
    assert(isValidString(options.signedAddr), "SignedAddr is invalid");
    assert(isValidFromChain(options.fromChain), "FromChain is invalid");
    assert(isValidCount(options.count), "Count is invalid");
    const res = await this.fetch({
      baseURL: this.baseUrl,
      url: `/tran/api/sequences/${options.publicKey}`,
      method: "get",
      params: {
        signedAddr: options.signedAddr,
        fromChain: options.fromChain,
        count: options.count
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
  
    return { code, msg, data: { seqs: data as number[] } };
  }

  /**
   * Batch sign transactions with the seqs from txpool service
   * @param options {
   *   txList: Array txs: [ ICreateExchange | ICancelExchange | IPayExchange ] types from @jccdex/jingtum-lib
   *   seqs: Array seqs get from txpool service
   *   secret: Account secret
   * }
   * @returns {ITxPoolData}
   */
  public async batchSignWithSeqs(options: IBatchSignData): Promise<ITxPoolData> {
    const { txList, seqs, secret } = options;
    assert(isValidTxList(txList),  "TxList is invalid");
    assert(isValideSeqs(seqs), "Seqs list is invalid");
    assert(seqs.length === txList.length, "Seqs quantity is not equal to tx quantity");
    assert(isValidString(secret), "Secret is invalid");
    assert(this.wallet.isValidSecret(secret), "Secret is invalid");
    delete options.secret;
    
    const account = this.getAddressPublicKey(secret);
    const signedList = [];
    seqs.forEach((seq, index) => {
      const tx = txList[index];
      tx.Sequence = seq;
      const signed = this.wallet.sign(tx, secret);
      signedList.push({
        txSign: signed.blob,
        txHash: signed.hash,
        txAddr: account.address,
        txSeq: seq
      });
    });
    const dataStr = JSON.stringify(signedList);
    const hash = this.sm3().update(dataStr).digest("hex");
    const KeyPair = this.wallet.wallet.KeyPair;
    const privateKey = KeyPair.deriveKeyPair(secret).privateKey;

    return {
      dataHashSign: KeyPair.sign(funcBytesToHex(Buffer.from(hash)), privateKey),
      dataJsonStr: dataStr
    };
  }

  /**
   * 提交交易内容到交易池
   * @param options {
   *   publicKey: 公钥
   *   submitPara: ITxPoolData 
   * }
   * @returns {ISubmitResponse}
   */
  public async submitToTxPool(options: ISubmitOptions): Promise<ISubmitResponse> {
    const { publicKey, submitPara } = options;
    assert(isValidString(publicKey), "PublicKey is invalid");
    assert(isValidString(submitPara.dataHashSign), "DataHashSign is invalid");
    assert(isValidString(submitPara.dataJsonStr), "DataJsonStr is invalid");
    const res = await this.fetch({
      baseURL: this.baseUrl,
      url: `/tran/api/submit/${publicKey}`,
      method: "post",
      data: submitPara
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
  
    return { code, msg, data:{ success: data as boolean}};
  }

  /**
   * 请求服务接口获取某个地址指定状态的交易列表
   * @param options {
   *    publicKey   公钥
   *    state       要查询的交易的状态
   *    count       要查询的交易数目
   * }
   * @returns {IFetchSubmittedResponse}
   */
  // * ===这里我们一般会在上传交易30秒后，指定4状态来查询一条数据，若查询不到说明上传的数据均已提交上链且未出错；
  // * ===如果服务端交易数据没有产生堆积的话，指定2状态查询一条数据也是可行的；
  // * ===若短时间内上传了多个钱包地址的大量交易数据，此时需要慎重，因为30秒内可能有地址还未轮训到或者有交易还未提交上链；
  public async fetchSubmittedData(options: IFetchSubmittedOptions): Promise<IFetchSubmittedResponse> {
      const {publicKey, state, count } = options;
      assert(isValidString(publicKey), "PublicKey is invalid");
      assert(isValidQueryState(state), "State is invalid");
      assert(isValidQueryType(count), "Count is invalid");
      const res = await this.fetch({
        baseURL: this.baseUrl,
        url: `/tran/api/submitted/${publicKey}`,
        method: "get",
        params: {
          state: state,
          count: count
        }
      });
      const { code, msg, data } = res;
      if (!this.isSuccess(code)) {
        throw new CloudError(code, msg);
      }
    
      return { code, msg, data: {list: data as Array<ISubmittedData>} };
    }

  /**
   * 取消该地址所有未上链和上链失败的交易
   * @param options {
   *   publicKey   公钥
   *   signedAddr  对地址字符串签名后的内容 
   * }
   * @returns 接口返回的response
   */
  public async cancelSubmitChain(options: ICancelSubmitOptions): Promise<ICancelSubmitResponse> {
    const {publicKey, signedAddr } = options;
    assert(isValidString(publicKey), "PublicKey is invalid");
    assert(isValidString(signedAddr), "SignedAddr is invalid");
    const res = await this.fetch({
      baseURL: this.baseUrl,
      url: `/tran/api/cancel/${publicKey}`,
      method: "post",
      params: {
        signedAddr
      }
    });
    const { code, msg, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, msg);
    }
  
    return { code, msg, data:{ canceled: data as boolean } };
  }
}