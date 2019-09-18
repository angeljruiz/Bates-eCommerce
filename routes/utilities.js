var path = require('path');
var fs = require('fs');
var mw = require('../config/middleware');
var pager = require('../config/pager');

var User = require('../models/user');
var Image = require('../models/image');
var Order = require('../models/order');
var MF = require('../models/marinefish');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Session = require('../models/session');
var Locker = require('../scripts/locker');

var Mall = require('../scripts/mall');
let Paypal = require('../config/paypal');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

module.exports = (app, passport) => {
  Locker.removeLocks();
  Mall.loadMall(app);
  app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    if (!req.session.cart) {
      req.session.cart = new Cart;
    }
    Cart.getTotal(req.session.cart);
    pager.update(req, req.session.cart);
    next();
  });

  app.get('/addtocart', async (req, res) => {
    if (!req.query.sku || !req.query.amount) return res.redirect('back');
    let product = await Product.retrieve(['sku', req.query.sku], ['name', 'sku', 'price', 'description']);
    console.log(product);
    Cart.addItem(req.session.cart, product, parseInt(req.query.amount));
    res.redirect('/');
  });

  app.get('/remove/:sku/:amount', async (req, res) => {
    await Cart.removeItems(req.session.cart, [{ sku: req.params.sku, amount: req.params.amount}]);
    req.session.save();
    Locker.removeSKULock(req.sessionID, req.params.sku);
    res.redirect('back');
  });

  app.get('/deleteorder', (req, res) => {
    if (res.locals.aauth) {
      let order = new Order( {cid: req.query.cid});
      order.delete( () => {
        res.redirect('/admin');
      });
    }
  });

  app.get('/setshipping', async (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    let order = await Order.retrieve(['cid', req.query.cid]);
    order.shipped = req.query.tracking;
    delete order.cart;
    order.save(false, () => {
      res.redirect('back');
    });
  });

  app.post('/file_upload', upload.single('file'), (req, res) => {
    if (!res.locals.aauth || !req.query.sku) return res.redirect("back");
    fs.readFile(req.file.path, function(err, data) {
      let image = new Image({sku: req.query.sku, name: req.file.filename, type: req.file.originalname.split('.')[1].toLowerCase()});
      image.save(['sku', 'name', 'type']);
      res.redirect("back");
    });
  });

  app.get('/delete_image', (req, res) => {
    if (!res.locals.aauth || !req.query.name) return res.redirect("back");
    let image = new Image({name: req.query.name});
    fs.unlink('./uploads/' + req.query.name, () => {});
    image.delete( () => {
      res.redirect('back');
    })
  });

  app.get('/main', async (req, res) => {
    if (!req.query.sku) return res.send('');
    let image = await Image.retrieve(['sku', req.query.sku, 'ORDER BY sku LIMIT 1'], ['name']);
    if (!image) return res.send('');
    res.redirect('../uploads/' + image.name);
  });

  app.get('/rename', (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    let image = new Image({name: req.query.name, num: req.query.rename, edit: true});
    image.save(['num'], () => {
      res.redirect("back");
    });
  });

  app.post('/addfish', (req, res) => {
    if (!res.locals.aauth) return res.redirect('back');
    let c = new MF(req.body);
    c.edit = (req.body.editing == 'true');
    delete req.body.editing;
    c.save(false, () => {
      res.redirect('/admin');
    });
  });

  app.post('/create_payment', async (req, res) => {
    let locked = await Locker.lockResources(req.session.cart, req.sessionID);
    let payment = await Paypal.createPayment(req.session.cart);
    if (locked == true) {
      for (let i=0;i<payment.links.length;i++) {
        if (payment.links[i].rel === 'approval_url') {
          return res.redirect(payment.links[i].href);
        }
      }
    } else {
      await Cart.removeItems(req.session.cart, locked);
      req.flash('itemRemoved', 'We had to remove some items from your cart because they were sold out');
      res.redirect('/cart');
    }
  });

  app.get('/execute_payment', async (req, res) => {
    let payment = await Paypal.executePayment(req.query.PayerID, req.query.paymentId, req.session.cart);
    Locker.removeSessionLocks(req.sessionID);
    req.session.cart = 0;
    pager.update(req, req.session.cart);
    req.flash('thankyou', 'Thank you! We\'ll be shipping your order soon');
    res.redirect('thankyou?oid='+ req.query.paymentId);
  });

  app.get('/cancel_payment', (req, res) => {
    res.redirect('/cart');
  });

  app.post('/new', mw.validateInfo, passport.authenticate('signup', { session: true, failureRedirect: '/signup' }), async (req, res) => {
    let user = await User.retrieve(['id', req.user.id], false);
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  });

  app.get('/deleteproduct=:sku', (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    let t = new MF({sku: req.params.sku});
    t.delete();
    res.redirect('/admin');
  });

  app.post('/login', mw.validateInfo, passport.authenticate('login', { session: true, successRedirect : '/', failureRedirect : '/login' }));

  app.get('/logout', (req, res) => {
     req.logout();
     req.user = 0;
     setTimeout(() => {
       res.redirect('/');
     }, 1000);
  });

}
