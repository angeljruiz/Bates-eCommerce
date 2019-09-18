var User = require('../models/user.js');
var Image = require('../models/image.js');
var MF = require('../models/marinefish.js');
var Order = require('../models/order.js');
var Product = require('../models/product.js');

var fs = require('fs');

var mw = require('../config/middleware.js');

module.exports = (app, passport) => {

  app.get('/', async (req, res) => {
    let product = await Product.customQuery('SELECT * FROM product ORDER BY quantity DESC');
    res.render('index', { products: product });
  });

  app.get('/admin', async (req, res) => {
    if (!res.locals.aauth) res.redirect('/');
    let fishes = await Product.retrieve(false, ['sku', 'name']);
    res.render('admin', { fishes: fishes });
  });

  app.get('/thankyou', async (req, res) => {
    let order = await Order.retrieve(['cid', req.query.oid]);
    if (!order) return res.redirect('/');
    order.date = mw.formatDate(new Date(order.date));
    res.render('thankyou', order);
  });

  app.get('/orders', async (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    let orders = await Order.retrieve(['finalized', true, 'ORDER BY date DESC']);
    res.render('orders', { orders: orders });
  });

  app.get('/checkout', (req, res) => {
    if (req.session.cart.cid != -1)
      return res.redirect('/review');
    else return res.render('checkout');
  });

  app.get('/viewproduct=:sku', (req, res) => {
    let images = Image.retrieve(['sku', req.params.sku, 'ORDER BY num'], ['num', 'type', 'name']);
    let product = Product.retrieve(['sku', req.params.sku], false);
    Promise.all([images, product]).then( data => {
      if (!data[0]) data[0] = [];
      if (!Array.isArray(data[0])) data[0] = [data[0]];
      data[1].pics = data[0];
      res.render('viewproduct', data[1]);
    });
  });

  app.get('/editfish/:sku', (req, res) => {
    res.locals.editing = true;
    let images = Image.retrieve(['sku', req.params.sku, 'ORDER BY num'], ['num', 'type', 'name']);
    let product = MF.retrieve(['sku', req.params.sku], false);
    Promise.all([images, product]).then( data => {
      if (!data[0]) data[0] = [];
      if (!Array.isArray(data[0])) data[0] = [data[0]];
      data[1].pics = data[0];
      res.render('addfish', data[1]);
    });
  });

};
