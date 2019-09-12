var path = require('path');
var fs = require('fs');
var mw = require('./middleware.js');
var pager = require('../scripts/pager.js');

var User = require('../models/user.js');
var Image = require('../models/image.js');
var Order = require('../models/order.js');
var MF = require('../models/marinefish.js');
var Cart = require('../models/cart.js');
var Product = require('../models/product.js');
var Session = require('../models/session.js');
var Locker = require('../scripts/locker.js');

var paypal = require('paypal-rest-sdk');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

// Sandbox PayPal API
var CLIENT =
  'AXzOBjvJZPijajZquxOlRANdVqWPgu80U2FnuF9jvclxK3aE4WrjDWlYrbGcUXT22JzPiCrY4Ya11iSp';
var SECRET =
  'AXzOBjvJZPijajZquxOlRANdVqWPgu80U2FnuF9jvclxK3aE4WrjDWlYrbGcUXT22JzPiCrY4Ya11iSp';

paypal.configure({
  'mode': 'sandbox',
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
  order = new Order(order);
  order.save(false, () => {
    cart.cid = order.cid;
    cart.save(rtr);
  });
}

module.exports = (app, passport) => {
  Locker.removeLocks();
  app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    if (!req.session.cart) {
      req.session.cart = new Cart;
    }
    Cart.getTotal(req.session.cart);
    pager.update(req, req.session.cart);
    next();
  });

  app.get('/addtocart', (req, res) => {
    if (!req.query.id || !req.query.amount) return res.redirect('back');
    Product.retrieve(['id', req.query.id], ['name', 'id', 'price', 'description'], product => {
      Cart.addItem(req.session.cart, product, parseInt(req.query.amount));
      res.redirect('/');
    });
  });

  app.get('/remove/:id/:amount', async (req, res) => {
    await Cart.removeItems(req.session.cart, [{ id: req.params.id, amount: req.params.amount}]);
    req.session.save();
    Locker.removeIDLock(req.sessionID, req.params.id);
    res.redirect('back');
  });

  app.get('/deleteorder', (req, res) => {
    if (res.locals.aauth) {
      let order = new Order( {cid: req.query.cid});
      console.log(order);
      order.delete( () => {
        res.redirect('/admin');
      });
    }
  });

  app.get('/setshipping', (req, res) => {
    if (res.locals.aauth) {
      Order.retrieve(['cid', req.query.cid], order => {
          order.shipped = req.query.tracking;
          delete order.cart;
          order.save(false, () => {
            return res.redirect(req.header('Referer'));
          });
      });
    } else res.redirect('/');
  });

  app.post('/file_upload', upload.single('file'), (req, res) => {
    if (!res.locals.aauth || !req.query.id) return res.redirect("back");
    fs.readFile(req.file.path, function(err, data) {
      let image = new Image({id: req.query.id, name: req.file.filename, type: req.file.originalname.split('.')[1].toLowerCase()});
      image.save(['id', 'name', 'type']);
      res.redirect("back");
    });
  });

  app.get('/delete_image', (req, res) => {
    if (!res.locals.aauth || !req.query.name) return res.redirect("back");
    let image = new Image({name: req.query.name});
    image.delete( () => {
      res.redirect('back');
    })
  });

  app.get('/main', (req, res) => {
    if (!req.query.id) return res.send('');
    Image.retrieve(['id', req.query.id, 'ORDER BY id LIMIT 1'], ['name'], image => {
      if (!image) return res.send('');
      res.redirect('../uploads/' + image.name);
    });
  });

  app.get('/rename', (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    let image = new Image({name: req.query.name, num: req.query.rename, edit: true});
    image.save(['num'], () => {
      res.redirect("back");
    });
  });

  app.get('/image', (req, res) => {
    if (!req.query.name) return res.redirect('back');
    Image.retrieve(['name', req.query.name], ['data', 'type'], image => {
      res.contentType('image/' + image.type);
      res.send(image.data);
    });
  });

  app.post('/addfish', (req, res) => {
    if (res.locals.aauth) {
      let c = new MF(req.body);
      c.edit = (req.body.editing == 'true');
      delete req.body.editing;
      c.save(false, () => {
        res.redirect('/admin');
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
          "return_url": "http://localhost/execute_payment",
          "cancel_url": "http://localhost/cancel_payment"
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
    Locker.lockResources(req.session.cart, req.sessionID, async locked => {
      if (locked == true) {
          paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
              console.log(error.response);
              throw error;
            } else {
              for (let i=0;i<payment.links.length;i++) {
                if (payment.links[i].rel === 'approval_url') {
                  return res.redirect(payment.links[i].href);
                }
              }
            }
          });
      } else {
        await Cart.removeItems(req.session.cart, locked);
        req.flash('itemRemoved', 'We had to remove some items from your cart because they were sold out');
        res.redirect('/cart');
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
        Locker.removeSessionLocks(req.sessionID);
        saveOrder(payment, new Cart(req.session.cart), () => {
          req.session.cart = 0;
          pager.update(req, req.session.cart);
          req.flash('thankyou', 'Thank you! We\'ll be shipping your order soon');
          res.redirect('thankyou?oid='+ paymentId);
        });
      }
    });
  });

  app.get('/cancel_payment', (req, res) => {
    res.redirect('/cart');
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

  app.get('/deleteproduct=:id', (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    let t = new MF({id: req.params.id});
    t.delete();
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
