'use strict';
require('dotenv').config()
const axios = require('axios');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = mongoose;



const stockSchema = new Schema({
  stock: { type: String, required: true, default: "" },
  likes: [{ type: String }]
})

const Stock = mongoose.model('Stocks', stockSchema);
let isActive;

mongoose.connect(process.env.DB).then(() => {
  console.log("Connected to DB.")
  isActive = true;
}).catch(e => {
  console.log(`Error while connecting to DB : ${e}`)
  isActive = false;
})

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res) {
      if (isActive) {
      const { stock, like } = req.query;
      const encrypt_ip = bcrypt.hashSync(req.ip, 12);
      let req_stock = [];
      let req_like = [];

      !stock ?
        req_stock = []
        :
        stock.constructor === Array ? stock.map((d, i) => {
          req_stock[i] = d
        }) : req_stock.push(stock)
        ;

      !like ?
        req_like = []
        :
        like.constructor === Array ? like.map((d, i) => {
          req_like[i] = d
        }) : req_like.push(like)
        ;
      if (req_stock.length === 0) {
        res.send("No stock sent.");
        return;
      }

      if (req_stock.length > 2) {
        req_stock = [];
      }

      const init = async _ => {
        let stocks = [];

        let response = [];
        console.log("Requesting stock data...")
        for (let i = 0; i < req_stock.length; i++) {
          await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req_stock[i]}/quote`).then(d => {
            if (d.data !== "Invalid symbol") {
              stocks.push({
                symbol: d.data.symbol,
                price: d.data.latestPrice
              })

            }
          })
        }

        console.log("Data recieved.")

        const assemble = async () => {
          let output = [];
          try {
            for (let i = 0; i < stocks.length; i++) {
              const data = await Stock.findOne({ stock: stocks[i].symbol })
              if (data === null) {
                if (req_like[0] === 'true') {
                  const new_stock = new Stock({
                    stock: stocks[i].symbol,
                    likes: [encrypt_ip]
                  });

                  await new_stock.save().then(d => {
                    output.push(d)
                  });
                } else {
                  const new_stock = new Stock({
                    stock: stocks[i].symbol
                  });

                  await new_stock.save().then(d => {
                    output.push(d)
                  });
                }
              } else {
                if (req_like[0] === 'true') {
                  for (let j = 0; j < data.likes.length; j++) {
                    if (bcrypt.compareSync(req.ip, data.likes[j]) === true) {
                      output.push(data);
                      break;
                    } else {
                      data.likes.push(encrypt_ip);
                      await data.save().then(d => {
                        output.push(d)
                      });
                      break;
                    }
                  }

                } else {
                  output.push(data)
                }
              }
            }

            return Promise.resolve(output);
          } catch (e) {
            console.log(e);
          }

        }

        assemble().then((output) => {
          output.map((d, i) => {
            response[i] = {
              stock: d.stock,
              price: stocks[i].price,
              likes: d.likes.length
            }
          })
          if (output.length > 1) {
            const like_arr = [response[0].likes, response[1].likes];
            let new_response = response.map(d => d);
            new_response[0].likes = like_arr[0] - like_arr[1];
            new_response[1].likes = like_arr[1] - like_arr[0];
            res.json({
              stockData: new_response.map(d => ({
                stock: d.stock,
                price: d.price,
                rel_likes: d.likes
              }))
            })
          } else {
            res.json({
              stockData: response[0]
            })
          }
        })
      }
      init();
      } else {
        res.send("Connecting to server...");
      }
    });
};
