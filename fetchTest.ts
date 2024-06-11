import JCCDexExplorer from "./src/explorer";
const explorer = new JCCDexExplorer("https://swtcscan.jccdex.cn/");
explorer.timeout = 60000;
console.log("showTimeOffset", explorer.tradeType.Buy)

/**
 * ts-node ./fetchTest.ts
 */

    /** fetchBalances */
// const balanceOptions = {
//     uuid: "237937429342",
//     address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi"
// }
// explorer.fetchBalances(balanceOptions).then((res) => {
//     console.dir("balances:");
//     console.dir(res, {depth: null});
// }).catch((err) => {
//     console.log("error", err);
// });

    /** fetchOffers */
// const offersOptions = {
//     uuid: "293728782293",
//     address: "j4rmEZiaTdXBkgzXPdsu1JRBf5onngqfUi",
//     coinPair: "JETH-JBNB",
//     buyOrSell: explorer.tradeType.Buy,
//     size: explorer.pageSize.Size10,
// }
// explorer.fetchOffers(offersOptions).then((res) => {
//     console.log("offers:");
//     console.dir(res, {depth: null});
// }).catch((err) => {
//     console.log("error", err);
// })

    /** fetchHistoryOrders */
const historyOrdersOption = {
    uuid: "2304032094",
    address: "jPSkgmoaT8gtMcZaWV3ei9RVpuen8kFqZ8",
    size: explorer.pageSize.Size10,
    // beginTime: "2023-11-01",
    // endTime: "2023-12-31",
    type: explorer.orderType.OfferCreate,
    buyOrSell: explorer.tradeType.Sell,
    // coinPair: "JUSDT-JUNI",
}
explorer.fetchHistoryOrders(historyOrdersOption).then((res) => {
    console.log("orders:");
    console.dir(res, {depth: null});
}).catch((err) => {
    console.log("error", err);
})

    /** fetchIssuedTokens */
// const issuedTokensOption = {
//     uuid: "293728782293",
//     address: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
// }
// explorer.fetchIssuedTokens(issuedTokensOption).then((res) => {
//     console.log("tokens:");
//     console.dir(res, {depth: null});
// }).catch((err) => {
//     console.log("error", err);
// })

    /** fetchHistoryFees */
// const historyFeesOption = {
//     uuid: "293728782293",
//     address: "jaD7WM3G38RUBA12jtgXLGFXqgVZvCCq12",
//     size: explorer.pageSize.Size10,
// }
// explorer.fetchHistoryFees(historyFeesOption).then((res) => {
//     console.log("fees:");
//     console.dir(res, {depth: null});
// }).catch((err) => {
//     console.log("error", err);
// })