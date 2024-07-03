import { CloudError } from "./error";
import { defaultFetch } from "./fetch";
import {
  isValidString,
  isValidFromChain,
  isValidCount
} from "./util";
import {
  IAccount,
  IFetchSeqsOptions,
  IFetchSeqsResponse
} from "./txpoolTypes";
const assert = require("assert");

const JingtumWallet = require("@jccdex/jingtum-lib");
const SwtCommon = require("@swtc/common");

export default class JCCDexTxPool {

  public fetch;

  private baseUrl: string;

  constructor(baseUrl: string, customFetch?: unknown) {
    this.baseUrl = baseUrl;
    this.fetch = customFetch || defaultFetch;
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private isSuccess(code): boolean {
    return code === "0";
  }

  /**
   * get address、signedAddress and publicKey from secret
   * @param secret 
   * @returns {address signedAddress publicKey}
   */
  public getAddressPublicKey(secret: string): IAccount {
    assert(isValidString(secret), "Secret is invalid");
    const wallet = new JingtumWallet.Wallet("jingtum");
    assert(wallet.isValidSecret(secret), "Secret is invalid");

    const KeyPair = wallet.wallet.KeyPair;
    const kp = KeyPair.deriveKeyPair(secret);
    const privateKey = kp.privateKey;
    const publicKey = kp.publicKey;
    const address = KeyPair.deriveAddress(publicKey);
    const signedAddress = KeyPair.sign(SwtCommon.funcBytesToHex(Buffer.from(address)), privateKey);
    return { address, signedAddress, publicKey };
  }

/**
 * get Seqs from txpool service
 * @param publicKey 公钥
 * @param signedAddr 对地址字符串签名后的内容
 * @param fromChain 0-表示不从链上获取 1-表示从链上获取序列号
 * @param count 表示获取多少个序列号
 * @returns 接口返回的response
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
  
    return { code, msg, data: { seqs: data as string[] } };
  }
}



// ----------------------------------------------------------------------------
// /**
//    * 请求服务接口提交交易内容
//    * @param baseURL 服务接口地址
//    * @param secret 秘钥
//    * @param txPoolData 交易池数据
//    * @returns 接口返回的response
//    */
//   async submitData2Server(baseURL, secret, txPoolData)

// Url: /tran/api/submit/

// ----------------------------------------------------------------------------

// /**
//    * 请求服务接口获取某个地址指定状态的交易列表
//    * @param baseURL 服务接口地址
//    * @param secret 秘钥
//    * @param state 指定状态，1:客户端已上传 2:上链服务提交出错 3:上链服务提交成功 4:客户端已上传或上链服务提交出错 5:上链未确认
//    * 1: 表示只查询刚上传到交易服务，还未提交上链的数据
//    * 2: 表示只查询提交上链出错即不成功的数据
//    * 3: 表示只查询提交上链成功的数据
//    * 4: 表示查询包含1和2的数据
//    * 5: 表示查询还未确认上链确实成功的数据
//    * ===这里我们一般会在上传交易30秒后，指定4状态来查询一条数据，若查询不到说明上传的数据均已提交上链且未出错；
//    * ===如果服务端交易数据没有产生堆积的话，指定2状态查询一条数据也是可行的；
//    * ===若短时间内上传了多个钱包地址的大量交易数据，此时需要慎重，因为30秒内可能有地址还未轮训到或者有交易还未提交上链；
//    * @param count 表示查询一条还是全部数据，'one':一条 'total':全部
//    * @returns 接口返回的response
//    */
//   async getSubmittedData(baseURL, secret, state, count)

// Url: /tran/api/submitted/

// ----------------------------------------------------------------------------

// /**
//    * 请求服务接口取消该地址所有未上链交易
//    * @param baseURL 服务接口地址
//    * @param secret 秘钥
//    * @returns 接口返回的response
//    */
//   async cancelDataFromPool(baseURL, secret)

// Url: /tran/api/cancel/