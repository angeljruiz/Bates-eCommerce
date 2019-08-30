var path = require('path');
var fs = require('fs');
var mw = require('./middleware.js');
var pager = require('../scripts/pager.js');
var User = require('../models/user.js');
var Order = require('../models/order.js');
var MF = require('../models/marinefish.js');
var Cart = require('../models/cart.js');
var Product = require('../models/product.js');

var paypal = require('paypal-rest-sdk');

var CLIENT =
  'AXzOBjvJZPijajZquxOlRANdVqWPgu80U2FnuF9jvclxK3aE4WrjDWlYrbGcUXT22JzPiCrY4Ya11iSp';
var SECRET =
  'AXzOBjvJZPijajZquxOlRANdVqWPgu80U2FnuF9jvclxK3aE4WrjDWlYrbGcUXT22JzPiCrY4Ya11iSp';

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AXzOBjvJZPijajZquxOlRANdVqWPgu80U2FnuF9jvclxK3aE4WrjDWlYrbGcUXT22JzPiCrY4Ya11iSp',
  'client_secret': 'EPw5ghxA3qyPYTUXbXOhMLk7EaSZFIyAxFKHcIWy-dW82KZrSOFNZSXLbSmtH9EkKueDkP6S-eMXp6AR'
});

function itemList(cart) {
  let list = {};
  list.items = [];
  cart.items.forEach( (item, index) => {
    let t = {};
    t.name = item.name;
    t.sku = item.id;
    t.price = String(item.price);
    t.quantity = cart.amount[index];
    t.currency = "USD";
    t.description = item.description;
    list.items.push(t);
  });
  return list;
}

function saveOrder(payment, cart, rtr) {
  let fn, ln, name;
  let shipping = payment.transactions[0].item_list.shipping_address;
  name = shipping.recipient_name.split(' ');
  if (name.length == 2) {
    fn = name[0];
    ln = name[1];
  } else {
    fn = name[0];
    ln = name[2];
  }
  let order = {
    cid: payment.transactions[0].related_resources[0].sale.parent_payment,
    fn:  fn,
    ln: ln,
    date: payment.transactions[0].related_resources[0].sale.update_time,
    processing: false,
    finalized: true,
    shipped: false,
    city: shipping.city,
    state: shipping.state,
    line1: shipping.line1,
    postal_code: shipping.postal_code
  }
  Order.save(order, cart, rtr);
}


module.exports = (app, db, passport) => {

  app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    if (!req.session.cart) {
      req.session.cart = new Cart;
    }
    Cart.getTotal(req.session.cart);
    pager.update(req, req.session.cart);
    next();
  });

  app.get('/addtocart/:id/:amount', (req, res) => {
    db.getData(Product, ['name', 'id', 'price', 'description'], ['id', req.params.id], (product) => {
      let rtr = () => {
        req.session.save();
        res.redirect('/');
      }
      Cart.addItem(req.session.cart, product, parseInt(req.params.amount), Order, rtr);
    });
  });

  app.get('/remove/:id/:amount', (req, res) => {
    let rtr = () => {
      res.redirect('/');
    }
    Cart.removeItem(req.session.cart, req.params.id, req.params.amount, Order, rtr);
  });

  app.post('/addfish', (req, res) => {
    if (req.isAuthenticated() && req.user.username === 'angel') {
      let c = new MF(req.body);
      c.edit = (req.body.editing == 'true');
      delete req.body.editing;
      c.save( () => {
        res.redirect('/');
      });
    }
  });

  app.post('/create_payment', (req, res) => {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://192.168.0.7/execute_payment",
            "cancel_url": "http://localhost/cart"
        },
        "transactions": [{
            "item_list": itemList(req.session.cart),
            "amount": {
                "currency": "USD",
                "total": String(req.session.cart.total),
                "details": {
                  "subtotal": String(req.session.cart.subtotal),
                  "shipping": String(req.session.cart.shipping)
                }
            },
            "description": "Hand made, custom glass."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
        for (let i=0;i<payment.links.length;i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
});

  app.get('/execute_payment', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const payment_json = {
      'payer_id': payerId,
      'transactions': [{
        'amount': {
          'currency': 'USD',
          'total': String(req.session.cart.total)
        }
      }]
    };
    paypal.payment.execute(paymentId, payment_json, (err, payment) => {
      if (err) {
        console.log(err.response);
        throw err;
      } else {
        saveOrder(payment, req.session.cart, () => {
          req.session.cart = 0;
          pager.update(req, req.session.cart);
          req.flash('thankyou', 'Thank you! We\'ll be shipping your order soon');
          res.redirect('thankyou?oid='+ paymentId);
        });
      }
    });
  });

  app.post('/new', mw.validateInfo, passport.authenticate('signup', { session: true, failureRedirect: '/signup' }), (req, res) => {
    new User({ username: req.user.username }, (err, user) => {
      req.login(user, function(err) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    });
  });

  app.get('/deletefish=:id', (req, res) => {
    db.deleteData(MF, ['id', req.params.id,]);
    db.deleteData(Product, ['id', req.params.id,]);
    res.redirect('/admin');
  });

  app.post('/login', mw.validateInfo, passport.authenticate('login', { session: true, successRedirect : '/', failureRedirect : '/login' }));

  app.post('/asguest', mw.validInfo, (req, res) => {
    req.body.date = mw.formatDate(new Date());
    let rtr = () => { res.redirect('/review'); }
    if (req.session.cart.cid != -1)
      return rtr();
    let order = new Order(req.body, req.sessionID);
    req.session.cart.cid = order.cid;
    Order.save(order, req.session.cart, rtr);
  });

  app.get('/placeorder', (req, res) => {
    Order.getOrder(req.session.cart.cid, (order) => {
      if (order) {
        order.pn = mw.formatNumber(order.pn);
        Order.submit(order, () => {
          req.flash('thankyou', 'Thank you! We\'ll be shipping your order soon');
          req.session.cart = 0;
          pager.update(req, req.session.cart);
          res.render('review', order);
        });
      } else return res.redirect('/');
    });
  });


  app.get('/logout', (req, res) => {
     req.logout();
     req.user = 0;
     setTimeout(() => {
       res.redirect('/');
     }, 1000);
  });


}
