const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { default: axios } = require('axios');
chai.use(chaiHttp);

suite('Functional Tests', function () {
    test("Viewing one stock: GET request to /api/stock-prices/", (done) => {
        chai.request(server)
            .get("/api/stock-prices")
            .query({
                stock: "MSFT"
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.isObject(d.body);
                assert.hasAllKeys(d.body, ['stockData']);
                assert.equal(d.body.stockData.stock, "MSFT")
                assert.match(d.body.stockData.price, /\d/g);
                assert.match(d.body.stockData.likes, /\d/g)
                done();
            })
    }).timeout(10000)
    test("Viewing one stock and liking it: GET request to /api/stock-prices/", (done) => {
        chai.request(server)
            .get("/api/stock-prices")
            .query({
                stock: "MSFT",
                like: "true"
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.isObject(d.body);
                assert.hasAllKeys(d.body, ['stockData']);
                assert.equal(d.body.stockData.stock, "MSFT")
                assert.match(d.body.stockData.price, /\d/g);
                assert.match(d.body.stockData.likes, /\d/g)
                done();
            })
    }).timeout(10000)
    test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", (done) => {
        chai.request(server)
            .get("/api/stock-prices")
            .query({
                stock: "MSFT",
                like: "true"
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.isObject(d.body);
                assert.hasAllKeys(d.body, ['stockData']);
                assert.equal(d.body.stockData.stock, "MSFT")
                assert.match(d.body.stockData.price, /\d/g);
                assert.match(d.body.stockData.likes, /\d/g)
                done();
            })
    }).timeout(10000)
    test("Viewing two stocks: GET request to /api/stock-prices/", (done) => {
        chai.request(server)
            .get("/api/stock-prices")
            .query({
                stock: ["MSFT", "GOOG"],
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.isObject(d.body);
                assert.hasAllKeys(d.body, ['stockData']);
                assert.equal(d.body.stockData[0].stock, "MSFT")
                assert.match(d.body.stockData[0].price, /\d/g);
                assert.match(d.body.stockData[0].rel_likes, /\d/g)
                assert.equal(d.body.stockData[1].stock, "GOOG")
                assert.match(d.body.stockData[1].price, /\d/g);
                assert.match(d.body.stockData[1].rel_likes, /\d/g)
                done();
            })
    }).timeout(10000)
    test("Viewing two stocks and liking them: GET request to /api/stock-prices/", (done) => {
        chai.request(server)
            .get("/api/stock-prices")
            .query({
                stock: ["MSFT", "GOOG"],
                like: "true"
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.isObject(d.body);
                assert.hasAllKeys(d.body, ['stockData']);
                assert.equal(d.body.stockData[0].stock, "MSFT")
                assert.match(d.body.stockData[0].price, /\d/g);
                assert.match(d.body.stockData[0].rel_likes, /\d/g)
                assert.equal(d.body.stockData[1].stock, "GOOG")
                assert.match(d.body.stockData[1].price, /\d/g);
                assert.match(d.body.stockData[1].rel_likes, /\d/g)
                done();
            })
    }).timeout(10000)
});

