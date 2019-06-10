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


module.exports = (app, db, passport) => {

  app.use((req, res, next) => {
    if (!req.session.cart) {
      req.session.cart = new Cart;
    }
    Cart.getTotal(req.session.cart);
    pager.update(req, req.session.cart);
    next();
  });

  app.use( (req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
  });

  app.get('/photo/:id', mw.isLoggedOn, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../media/df.png'));
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
    db.getData(MF, ['name', 'id', 'price'], ['id', req.params.id], (fish) => {
      Cart.addItem(req.session.cart, fish, parseInt(req.params.amount));
      req.session.save();
    });
    res.redirect('/');
  });

  app.get('/remove/:id/:amount', (req, res) => {
    Cart.removeItem(req.session.cart, req.params.id, req.params.amount);
    res.redirect('/cart');
  });

  app.get('/image/:id/:num', (req, res) => {
    res.sendFile(path.join(__dirname, "../media/" + req.params.id + "-" + req.params.num + ".jpg"));
  });

  app.post('/addfish', (req, res) => {
    if (req.isAuthenticated() && req.user.username === 'angel') {
      let edit = req.body.editing;
      delete req.body.editing;
      db.saveData(MF, Object.keys(req.body), (edit == true? ['id', req.body.id] : false), Object.values(req.body), () => {
      });
    }
    res.redirect('/');
  });


  app.post('/new', mw.validateInfo, passport.authenticate('signup', { session: true, failureRedirect: '/signup' }), (req, res) => {
    new User({ username: req.user.username }, (err, user) => {
      req.login(user, function(err) {
        if (err)
          console.log(err);
        res.redirect('/');
      });
    });
  });

  app.get('/deletefish=:id', (req, res) => {
      db.deleteData(MF, ['id', req.params.id,], ()=> {
          res.redirect('/admin');
      });
  });
  app.get('/delete/:id', (req, res) => {
      db.deleteUser(req.params.id, ()=> {
          res.redirect('/list');
      });
  });

  app.post('/login', mw.validateInfo, passport.authenticate('login', { session: true, successRedirect : '/', failureRedirect : '/login' }));

  app.post('/asguest', mw.validInfo, (req, res) => {
    req.body.date = mw.formatDate(new Date());
    let order = new Order(req.body, req.session.cart, req.sessionID);
    req.session.cart.cid = order.cid;
    Order.save(order, req.session.cart, () => {
      res.redirect('/review');
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
