# @jccdex/cloud

TypeScript/JavaScript SDK for the JCCDex blockchain cloud services. Provides two client classes for querying the JCCDex explorer API and interacting with the transaction-pool service.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
  - [JCCDexExplorer](#jccdexexplorer)
  - [JCCDexTxPool](#jccdextxpool)
- [API Reference](#api-reference)
  - [JCCDexExplorer methods](#jccdexexplorer-methods)
  - [JCCDexTxPool methods](#jccdextxpool-methods)
  - [Enums](#enums)
- [Error Handling](#error-handling)
- [Custom Fetch / Interceptors](#custom-fetch--interceptors)
- [Security Notes](#security-notes)
- [Development](#development)
- [License](#license)

---

## Installation

```bash
npm install @jccdex/cloud
# or
yarn add @jccdex/cloud
```

Requires Node.js ≥ 16 or a modern browser environment.

---

## Quick Start

### JCCDexExplorer

Query the on-chain explorer API.

```typescript
import { JCCDexExplorer, PageSize, TradeType } from "@jccdex/cloud";

const explorer = new JCCDexExplorer("https://swtcscan.jccdex.cn");

// Fetch token balances for a wallet address
const result = await explorer.fetchBalances({
  uuid: "jGa9J9TkqtBc",                        // server node identifier
  address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
});
console.log(result.data.balances);
// [{ currency: "SWT", issuer: "", value: "100", frozen: "0" }, ...]
```

### JCCDexTxPool

Sign and submit batched transactions via the transaction pool.

```typescript
import { JCCDexTxPool, AbstractKeyPair } from "@jccdex/cloud";
import { Keypair } from "@jccdex/jingtum-lib"; // your keypair implementation

const keypair = new Keypair();
const pool = new JCCDexTxPool("https://txpool.jccdex.cn", keypair);

// 1. Derive public key from secret (secret never leaves client)
const { address, signedAddress, publicKey } = pool.getAddressPublicKey("snXXX...");

// 2. Get sequence numbers from the pool
const { data: { seqs } } = await pool.getSeqsFromTxPool({
  uuid: "jGa9J9TkqtBc",
  publicKey,
  signedAddr: signedAddress,
  fromChain: 0,
  count: 1
});

// 3. Build, sign and submit transactions
const txList = [{
  TransactionType: "Payment",
  Account: address,
  Destination: "jDestinationAddress...",
  Amount: { currency: "SWT", issuer: "", value: "1" },
  Fee: 10000,
  Flags: 0,
  Memos: []
}];

const submitPara = await pool.batchSignWithSeqs({ txList, seqs, secret: "snXXX..." });

await pool.submitToTxPool({ uuid: "jGa9J9TkqtBc", publicKey, submitPara });
```

---

## API Reference

### JCCDexExplorer methods

All methods are `async` and reject with a `CloudError` on non-success API responses, or with a plain `Error` on invalid input.

| Method | Parameters | Returns |
|---|---|---|
| `fetchBalances(options)` | `{ uuid, address }` | `{ balances: IBalance[] }` |
| `fetchOffers(options)` | `{ uuid, address, page?, size?, coinPair?, buyOrSell? }` | `{ offers: IOffer[], count: number }` |
| `fetchOffersDetail(options)` | `{ uuid, address, seq, searchType? }` | `{ offerStatus?, offerHistory? }` |
| `fetchHistoryOrders(options)` | `{ uuid, address, page?, size?, beginTime?, endTime?, type?, coinPair?, buyOrSell? }` | `{ historOrders: IHistoryOrder[] }` |
| `fetchIssuedTokens(options)` | `{ uuid, address }` | `{ tokens: IIssueToken[] }` |
| `fetchHistoryFees(options)` | `{ uuid, address, page?, size?, tokenAndIssuer? }` | `{ fees: IHistoryFee[] }` |
| `fetchBlockTransactions(options)` | `{ uuid, blockNumber, page?, size? }` | `{ transactions: IBlockTransaction[], count: number }` |
| `fetchLatestSixBlocks(options)` | `{ uuid }` | `{ blocks: IBlockInfo[] }` |
| `fetchAllBlocks(options)` | `{ uuid, page?, size? }` | `{ blocks: IBlockInfo[] }` |
| `fetchIssuedNfts(options)` | `{ uuid, issuer?, page?, size? }` | `{ nfts[], count: number }` |
| `fetchNftsName(options)` | `{ uuid, tokenName? }` | `{ tokenNames[] }` |
| `fetchNftTokenId(options)` | `{ uuid, tokenId? }` | `{ tokenIds: string[] }` |
| `fetchNftTransfers(options)` | `{ uuid, page?, size?, tokenId?, address?, type?, beginTime?, endTime?, counterparty? }` | `{ transfers[], count: number }` |
| `fetchNftConfigs(options)` | `{ uuid, issuer?, fundCodeName? }` | `{ nfts[] }` |
| `fetchNftTokenInfo(options)` | `{ uuid, page?, size?, tokenId?, address?, issuer?, fundCodeName?, valid? }` | `{ nfts[], count: number }` |
| `fetchLatestSixHash(options)` | `{ uuid }` | `{ hashInfos: IHashInfo[] }` |
| `fetchAllHash(options)` | `{ uuid, page?, size?, type?, buyOrSell?, beginTime?, endTime?, coinPair?, matchFlag? }` | `{ hashInfos: IHashInfo[], count: number }` |
| `fetchHashDetailInfo(options)` | `{ uuid, hash }` | block or transaction hash detail |
| `fetchBlockTransactionsByHash(options)` | `{ uuid, blockHash, page?, size? }` | `{ transactions[] }` |
| `fetchTokensInfo(options)` | `{ uuid, page?, size?, issuer?, token? }` | `{ tokens: ITokenInfo[], count: number }` |
| `fetchTokensCirculationInfo(options)` | `{ uuid, token, issuer?, page?, size? }` | `{ tokenInfo: ITokenCirculationInfo }` |
| `fetchTokensList(options)` | `{ uuid, keyword? }` | grouped or flat token list |
| `fetchTokensTradeStatistic(options)` | `{ uuid }` | `{ list: ITradeStatistic[] }` |
| `fetchNewUserStatistic(options)` | `{ uuid }` | `{ list: IUserStatistic[] }` |
| `fetchTokenBalanceStatistic(options)` | `{ uuid, address, token, page?, size?, beginTime?, endTime? }` | `{ balances[] }` |
| `fetchLatestTransactions(options)` | `{ uuid, base, counter }` | `{ records: ITransactionRecord[] }` |

**`uuid`** is a server node/cluster identifier provided by the JCCDex service operator. It is **not** an end-user value.

### JCCDexTxPool methods

| Method | Parameters | Returns |
|---|---|---|
| `getAddressPublicKey(secret)` | `secret: string` | `{ address, signedAddress, publicKey }` |
| `getSeqsFromTxPool(options)` | `{ uuid, publicKey, signedAddr, fromChain, count }` | `{ seqs: number[] }` |
| `batchSignWithSeqs(options)` | `{ txList, seqs, secret }` | `{ dataHashSign, dataJsonStr }` |
| `submitToTxPool(options)` | `{ uuid, publicKey, submitPara }` | `{ success: boolean }` |
| `fetchSubmittedData(options)` | `{ uuid, publicKey, state, count }` | `{ list: ISubmittedData[] }` |
| `cancelSubmitChain(options)` | `{ uuid, publicKey, signedAddr }` | `{ canceled: boolean }` |
| `fetchTxPoolQueues(options)` | `{ uuid, publicKey, state, type }` | `{ count: number }` |

### Enums

```typescript
import { PageSize, TradeType, OrderType, TransactionType, NFTStatus, NftTransactionType } from "@jccdex/cloud";
import { QueryState, QueryType, QueuesState, QueuesType } from "@jccdex/cloud"; // from txpoolTypes

// PageSize: TEN(10) | TWENTY(20) | FIFTY(50) | HUNDRED(100)
// TradeType: ALL("") | BUY(1) | SELL(2)
// OrderType: OfferCreate | OfferAffect | OfferCancel | Send | Receive | ...
// QueryState: SentService(1) | SubmitChainError(2) | SubmitChainSuccess(3) | ServedAndChainError(4) | SubmitChainUnknow(5)
// QueryType: ONE("one") | ALL("total")
// QueuesState: WaittingSubmit | SubmitError | WaittingConfirm
// QueuesType: SELF | TOTAL
```

---

## Error Handling

```typescript
import { CloudError } from "@jccdex/cloud";

try {
  const result = await explorer.fetchBalances({ uuid: "jGa9J9TkqtBc", address: "jXXX" });
} catch (err) {
  if (err instanceof CloudError) {
    // API returned a non-success response code
    console.error(err.code, err.message);
  } else {
    // Invalid input (e.g. empty address, invalid page size)
    console.error(err.message);
  }
}
```

`CloudError` has `code: string` (the API response code) and `message: string` (the API error message).

---

## Custom Fetch / Interceptors

Both constructors accept an optional `customFetch` argument built with `AxiosInterceptorsFactory`:

```typescript
import { AxiosInterceptorsFactory, JCCDexExplorer } from "@jccdex/cloud";

const customFetch = AxiosInterceptorsFactory({
  timeout: 10000,
  customRequest: async (config) => {
    config.headers["X-API-Key"] = "my-api-key";
  },
  customResponse: async (response) => {
    return response.data;
  }
});

const explorer = new JCCDexExplorer("https://swtcscan.jccdex.cn", customFetch);
```

---

## Security Notes

- **Always use HTTPS** for `baseUrl`. Plain HTTP connections are vulnerable to man-in-the-middle attacks, including credential and secret interception.
- **Never log secrets.** The `secret` parameter in `batchSignWithSeqs` and `getAddressPublicKey` is a private key. It is removed from the options object after use but may still appear in error logs or stack traces if not handled carefully.
- **Supply chain hygiene.** Run `yarn npm audit` (or `npm audit`) regularly and before releasing. A convenience script is provided:
  ```bash
  yarn audit      # runs: yarn npm audit --severity moderate
  ```
- **`uuid` is a server identifier, not user-supplied data.** Do not expose end-user controlled strings as the `uuid` parameter.

---

## Development

```bash
# Install dependencies
yarn install

# Run tests with coverage
yarn test

# Compile TypeScript to lib/
yarn compile

# Lint
yarn lint

# Check for supply chain vulnerabilities
yarn audit

# Publish (maintainers only)
yarn deploy
```

---

## License

[MIT](LICENSE) © JCCDex
