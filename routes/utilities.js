var path = require('path');
var fs = require('fs');
var mw = require('../config/middleware');
var pager = require('../config/pager');

var User = require('../models/user');
var Image = require('../models/image');
var Order = require('../models/order');
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
    pager.update(req);
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
    await Cart.removeItems(req.session.cart, [{ sku: req.params.sku, quantity: req.params.amount}]);
    req.session.save();
    Locker.removeIDLock(req.sessionID, req.params.sku);
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
    order.save(false, order.publicKey(), () => {
      res.redirect('back');
    });
  });

  app.post('/file_upload', upload.single('file'), mw.resizeImages, async (req, res) => {
    if (!res.locals.aauth || !req.query.sku) return res.redirect("back");
    fs.readFile(req.file.path, 'hex', async function(err, data) {
    data = '\\x' + data;
    let image = new Image({sku: req.query.sku, name: req.file.filename, data: data, type: req.file.originalname.split('.')[1].toLowerCase()});
    image.save(['sku', 'name', 'type', 'data']);
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
    let image = await Image.retrieve(['sku', req.query.sku, 'ORDER BY num LIMIT 1'], ['name']);
    if (!image) return res.send('');
    res.redirect('../uploads/' + image.name);
  });

  app.get('/rename', (req, res) => {
    if (!res.locals.aauth) return res.redirect('/');
    let image = new Image({name: req.query.name, num: req.query.rename, edit: true});
    image.save(['num'], image.publicKey(), () => {
      res.redirect("back");
    });
  });

  app.post('/addproduct', (req, res) => {
    if (!res.locals.aauth) return res.redirect('back');
    let c = new Product(req.body);
    c.save(false, false, () => {
      res.redirect('/admin');
    });
  });

  app.post('/editproduct', (req, res) => {
    if (!res.locals.aauth) return res.redirect('back');
    let c = new Product(req.body);
    c.save(false, c.publicKey(), () => {
      res.redirect('/admin');
    });
  });

  app.post('/create_payment', async (req, res) => {
    let locked = await Locker.lockResources(req.session.cart, req.sessionID);
    let payment = await Paypal.createPayment(req.session.cart);
    if (locked === true) {
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
    req.flash('thankyou', "Thank you! We'll be shipping your order soon");
    res.redirect('/thankyou?oid='+ req.query.paymentId);
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
    let t = new Product({sku: req.params.sku});
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
