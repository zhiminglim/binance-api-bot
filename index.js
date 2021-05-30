require("dotenv").config();
const port = process.env.PORT || 3000;
const axios = require('axios').default;
const express = require("express");
const app = express();
const CryptoJS = require("crypto-js");

const BASE_URL = "https://api.binance.com";
const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY;



app.get("/", (req, res) => {
    res.send("Express App is up and working!");
})

app.get("/symbol-avg-price", (req, res) => {
    console.log("in test dir");
    axios.get(BASE_URL + "/api/v3/avgPrice", {
        params: {
            symbol: "LTCUSDT"
        }
    }).then(response => {
        if (response.status == "200") {
            console.log("response OK");
            console.log(response.data);
        }
    }).catch(error => {
        console.log(error);
    }).then(() => {
        // always executed
    })

    res.send("200 OK");
})

app.get("/user-account-info", (req, res) => {

    let timestamp = new Date().getTime();
    let signature = CryptoJS.HmacSHA256("".concat("timestamp=", timestamp), BINANCE_SECRET_KEY).toString(CryptoJS.enc.Hex);

    let config = {
        url: BASE_URL + "/api/v3/account",
        method: "GET",
        headers: {
            "X-MBX-APIKEY": BINANCE_API_KEY
        },
        params: {
            timestamp: timestamp,
            signature: signature
        }
    }

    axios(config)
        .then(response => {
            console.log("status code : " + response.status);
            //console.log(response.data);

            if (response.data != null && response.data.balances != null) {
                const holdings = response.data.balances.filter(ele => {
                    return (ele.free != 0.0);
                })
                console.log(holdings);
            }
            
        }).catch(error => {
            console.log(error);
        }).then(() => {
            // always executed
        });

    res.send("OK");
})

app.get("/user-open-orders", (req, res) => {

    let timestamp = new Date().getTime();
    let recvWindow = "10000";
    const amp = "&";
    let symbol = "LTCUSDT";
    let symbolParams = "symbol=" + symbol;
    let timestampParams = "timestamp=" + timestamp;
    let recvWindowParams = "recvWindow=" + recvWindow;
    let params = "".concat(symbolParams, amp, timestampParams, amp, recvWindowParams);
    let signature = CryptoJS.HmacSHA256(params, BINANCE_SECRET_KEY).toString(CryptoJS.enc.Hex);

    let config = {
        url: BASE_URL + "/api/v3/openOrders",
        method: "GET",
        headers: {
            "X-MBX-APIKEY": BINANCE_API_KEY
        },
        params: {
            symbol: "LTCUSDT",
            timestamp: timestamp,
            recvWindow: recvWindow,
            signature: signature
        }
    }

    axios(config)
        .then(response => {
            console.log("status code : " + response.status);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        }).then(() => {
            // always executed
        });

    res.send("OK");
})




app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
})