import { CloudError } from "./error";
import { defaultFetch } from "./fetch";
import {
  isValidString,
  isValidFromChain,
  isValidCount,
  isValideSeqs,
  isValidQueryState,
  isValidQueryType,
  funcBytesToHex,
  isValidQueuesState,
  isValidQueuesType
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
  ICancelSubmitResponse,
  ICreateExchange,
  ICancelExchange,
  IPayExchange,
  IFetchTxPoolQueuesOptions,
  IFetchTxPoolQueuesResponse,
  QueuesState,
  QueuesType
} from "./txpoolTypes";
import { AbstractKeyPair } from "./types";
const assert = require("assert");

export default class JCCDexTxPool {
  public fetch;

  private baseUrl: string;

  public queryState = QueryState;

  public queryType = QueryType;

  public queuesState = QueuesState;

  public queuesType = QueuesType;

  private keypair;

  constructor(baseUrl: string, keypair: AbstractKeyPair, customFetch?: unknown) {
    this.baseUrl = baseUrl;
    this.fetch = customFetch || defaultFetch;
    this.keypair = keypair;
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
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
    assert(this.keypair.isValidSecret(secret), "Secret is invalid");
    const kp = this.keypair.deriveKeyPair(secret);
    const privateKey = kp.privateKey;
    const publicKey = kp.publicKey;
    const address = this.keypair.deriveAddress(publicKey);
    const signedAddress = this.keypair.sign(funcBytesToHex(Buffer.from(address)), privateKey);
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
    const { code, message, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, message);
    }

    return { code, msg: message, data: { seqs: data as number[] } };
  }

  /**
   * to check the txList data is valid or not
   * @param list
   * @returns {boolean}
   */
  private isValidTxList = (v: (ICreateExchange | ICancelExchange | IPayExchange)[]): boolean => {
    const wallet = this.keypair;
    return (
      Array.isArray(v) &&
      v.length > 0 &&
      v.every((tx) => {
        const type = tx.TransactionType as string;
        switch (type) {
          case "OfferCreate":
            return (
              "Account" in tx &&
              wallet.isValidAddress(tx.Account) &&
              "Fee" in tx &&
              typeof tx.Fee === "number" &&
              "Flags" in tx &&
              (tx.Flags === 0x00080000 || tx.Flags === 0) &&
              "Platform" in tx &&
              typeof tx.Platform === "string" &&
              "TakerGets" in tx &&
              typeof tx.TakerGets === "object" &&
              "TakerPays" in tx &&
              typeof tx.TakerPays === "object"
            );
          case "OfferCancel":
            return (
              "Account" in tx &&
              wallet.isValidAddress(tx.Account) &&
              "Fee" in tx &&
              typeof tx.Fee === "number" &&
              "Flags" in tx &&
              tx.Flags === 0 &&
              "OfferSequence" in tx &&
              Number.isInteger(tx.OfferSequence)
            );
          case "Payment":
            return (
              "Account" in tx &&
              wallet.isValidAddress(tx.Account) &&
              "Amount" in tx &&
              (typeof tx.Amount === "object" || typeof tx.Amount === "string") &&
              "Destination" in tx &&
              wallet.isValidAddress(tx.Destination) &&
              "Fee" in tx &&
              typeof tx.Fee === "number" &&
              "Flags" in tx &&
              tx.Flags === 0 &&
              "Memos" in tx
            );
          default:
            return false;
        }
      })
    );
  };

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
    assert(this.isValidTxList(txList), "TxList is invalid");
    assert(isValideSeqs(seqs), "Seqs list is invalid");
    assert(seqs.length === txList.length, "Seqs quantity is not equal to tx quantity");
    assert(isValidString(secret), "Secret is invalid");
    assert(this.keypair.isValidSecret(secret), "Secret is invalid");
    delete options.secret;

    const account = this.getAddressPublicKey(secret);
    const signedList = [];
    seqs.forEach((seq, index) => {
      const tx = txList[index];
      tx.Sequence = seq;
      const signed = this.keypair.signTx(tx, secret);
      signedList.push({
        txSign: signed.blob,
        txHash: signed.hash,
        txAddr: account.address,
        txSeq: seq
      });
    });
    const dataStr = JSON.stringify(signedList);
    const hash = this.keypair.hash(dataStr);
    const privateKey = this.keypair.deriveKeyPair(secret).privateKey;

    return {
      dataHashSign: this.keypair.sign(funcBytesToHex(Buffer.from(hash)), privateKey),
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
    const { code, message, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, message);
    }

    return { code, msg: message, data: { success: data as boolean } };
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
    const { publicKey, state, count } = options;
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
    const { code, message, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, message);
    }

    return { code, msg: message, data: { list: data as Array<ISubmittedData> } };
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
    const { publicKey, signedAddr } = options;
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
    const { code, message, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, message);
    }

    return { code, msg: message, data: { canceled: data as boolean } };
  }

  /**
   * 获取交易池中的交易数量
   * @param options {
   *  publicKey 公钥
   *  state     查询的状态 1.等待上链 2.上链时出错 3.已提交上链,但等待链上确认
   *  type      查询的范围 self 仅查询自己的交易 total 查询所有的交易
   * }
   * @returns {IFetchTxPoolQueuesResponse}
   */
  public async fetchTxPoolQueues(options: IFetchTxPoolQueuesOptions): Promise<IFetchTxPoolQueuesResponse> {
    const { publicKey, state, type } = options;
    assert(isValidString(publicKey), "PublicKey is invalid");
    assert(isValidQueuesState(state), "State is invalid");
    assert(isValidQueuesType(type), "Type is invalid");
    const res = await this.fetch({
      baseURL: this.baseUrl,
      url: `/tran/api/pool-data/current-count/${publicKey}`,
      method: "get",
      params: {
        state,
        type
      }
    });
    const { code, message, data } = res;
    if (!this.isSuccess(code)) {
      throw new CloudError(code, message);
    }

    return { code, msg: message, data: { count: data as number } };
  }
}
