var User = require('../models/user.js');
var MF = require('../models/marinefish.js');
var Order = require('../models/order.js');
var Product = require('../models/product.js');

var mw = require('./middleware.js');


module.exports = (app, db, passport) => {

  app.get('/', (req, res) => {
    db.getData(Product, ['id', 'price', 'name'], 'all', (fish) => {
      res.render('index', { fishes: fish });
    });
  });

  app.get('/admin', (req, res) => {
    if (res.locals.aauth) {
      db.getData(Product, ['id', 'name'], 'all', (fishes) => {
        res.render('admin', { fishes: fishes });
      });
    } else
      res.redirect('/');
  });

  app.get('/review', (req, res) => {
    Order.getOrder(req.session.cart.cid, (order) => {
      if (order) {
        order.pn = mw.formatNumber(order.pn);
        res.render('review', order);
      } else return res.redirect('/');
    });
  });

  app.get('/checkout', (req, res) => {
    if (req.session.cart.cid != -1)
      return res.redirect('/review');
    else return res.render('checkout');
  });

  app.get('/viewfish=:id', (req, res) => {
    MF.getProduct(req.params.id, (fish)=> {
      res.render('viewfish', fish);
    });
  });

  app.get('/editfish/:id', (req, res) => {
    res.locals.editing = true;
    if (req.isAuthenticated() && req.user.username === 'angel') {
      MF.getProduct(req.params.id, (fish) => {
        res.render('addfish', fish);
      });
    }
  });

};
