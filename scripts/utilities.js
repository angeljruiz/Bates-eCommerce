var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var path = require('path');
var fs = require('fs');
var mw = require('./middleware.js');
var pager = require('../scripts/pager.js');
var User = require('../models/user.js');
var Order = require('../models/order.js');
var MF = require('../models/marinefish.js');
var Cart = require('../models/cart.js');
var Product = require('../models/product.js');

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

  app.post('/upload', upload.any(), (req, res) => {
    if (req.isAuthenticated() && req.user.username === 'angel') {
      fs.readFile(req.files[0].path, (err, data) => {
        if (err)
          return console.error('error reading file', err);
        db.uploadMedia(req.files[0].originalname, data, () => {
          fs.unlink(req.files[0].path);
        });
      });
    }
  });

  app.get('/addtocart/:id/:amount', (req, res) => {
    db.getData(Product, ['name', 'id', 'price'], ['id', req.params.id], (product) => {
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
          req.flash('thankyou', 'Thank you! We\'re preparing your new fish now');
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
