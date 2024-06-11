import JCCDexExplorer from "./src/explorer";
const explorer = new JCCDexExplorer("https://expjia1b6719b6e6.jccdex.cn");
console.log("showTimeOffset", explorer.timeOffset)

/**
 * ts-node ./fetchTest.ts
 */

    /** fetchBalances */
// const balanceOptions = {
//     uuid: "237937429342",
//     address: "jL7Q26qWtWxZtZUpdEq5KZbuJBXbyuiKpe"
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
//     address: "jL7Q26qWtWxZtZUpdEq5KZbuJBXbyuiKpe",
//     // coinPair: "JETH-JBNB",
//     // buyOrSell: 1
// }
// explorer.fetchOffers(offersOptions).then((res) => {
//     console.log("offers:");
//     console.dir(res, {depth: null});
// }).catch((err) => {
//     console.log("error", err);
// })

    /** fetchHistoryOrders */
const historyOrdersOption = {
    uuid: "293728782293",
    address: "jL7Q26qWtWxZtZUpdEq5KZbuJBXbyuiKpe",
    size: 10,
    // beginTime: "2023-11-01",
    // endTime: "2023-12-31",
    type: explorer.orderType.OfferCreate,
    // buyOrSell: 0,
    // coinPair: "",
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
//     size: 10
// }
// explorer.fetchHistoryFees(historyFeesOption).then((res) => {
//     console.log("fees:");
//     console.dir(res, {depth: null});
// }).catch((err) => {
//     console.log("error", err);
// })