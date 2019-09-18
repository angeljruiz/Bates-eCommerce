let express = require('express');
let Store = require('../models/store.js');
let Product = require('../models/product.js');

let router;

class Mall {
  constructor() {
    this.stores = [];
  }
  async loadMall(app) {
    let stores = await Store.retrieve(false, false);
    if (!stores) return;
    if (!Array.isArray(stores)) stores = [stores];
    stores.forEach( store => {
      router = express.Router();
      router.get('/', async (req, res) => {
        let products = await Product.retrieve(['store', store.id], false);
        res.render('index', { products: products });
      });
      app.use('/' + store.url, router);
    });
  }
}

module.exports = new Mall;
