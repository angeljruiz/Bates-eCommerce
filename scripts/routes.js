var User = require('../models/user.js');
var Image = require('../models/image.js');
var MF = require('../models/marinefish.js');
var Order = require('../models/order.js');
var Product = require('../models/product.js');

var fs = require('fs');

var mw = require('./middleware.js');

module.exports = (app, passport) => {

  app.get('/', (req, res) => {
    Product.retrieve(false, false, fish => {
      res.render('index', { fishes: fish });
    });
  });

  app.get('/admin', (req, res) => {
    if (res.locals.aauth) {
      Product.retrieve(false, ['id', 'name'], fishes => {
        res.render('admin', { fishes: fishes });
      });
    } else
      res.redirect('/');
  });

  app.get('/thankyou', (req, res) => {
    Order.retrieve(['cid', req.query.oid], order => {
      if (order) {
        order.date = mw.formatDate(new Date(order.date));
        res.render('thankyou', order);
      } else return res.redirect('/');
    });
  });

  app.get('/orders', (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    Order.retrieve(['finalized', true], orders => {
        res.render('orders', { orders: orders });
    });
  });

  app.get('/checkout', (req, res) => {
    if (req.session.cart.cid != -1)
      return res.redirect('/review');
    else return res.render('checkout');
  });

  app.get('/viewproduct=:id', (req, res) => {
    Image.retrieve(['id', req.params.id, 'ORDER BY num'], ['num', 'type', 'name'], images => {
      if (!images) images = [];
      if (!Array.isArray(images)) images = [images];
      Product.retrieve(['id', req.params.id], false, fish => {
        fish.pics = images;
        res.render('viewproduct', fish);
      });
    });
  });

  app.get('/editfish/:id', (req, res) => {
    res.locals.editing = true;
    Image.retrieve(['id', req.params.id, 'ORDER BY num'], ['num', 'type', 'name'], images => {
      if (!images) images = [];
      if (!Array.isArray(images)) images = [images];
      if (res.locals.aauth) {
        MF.retrieve(['id', req.params.id], false, fish => {
          fish.pics = images;
          res.render('addfish', fish);
        });
      }
    });
  });

};
