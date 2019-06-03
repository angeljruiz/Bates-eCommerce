var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var path = require('path');
var fs = require('fs');
var mw = require('./middleware.js');
var pager = require('../scripts/pager.js');
var User = require('../models/user.js');
var Cart = require('../scripts/cart.js');


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
    db.getfishc(req.params.id, (fish) => {
      Cart.addItem(req.session.cart, fish, req.params.amount);
      req.session.save();
    });
    res.redirect('/');
  });

  app.get('/image/:id/:num', (req, res) => {
    res.sendFile(path.join(__dirname, "../media/" + req.params.id + "-" + req.params.num + ".jpg"));
  });

  app.post('/addfish', (req, res) => {
    if (req.isAuthenticated() && req.user.username === 'angel') {
      db.addfish(req.body);
    }
    res.redirect('/');
  });

  app.get('/getfish', (req, res) => {
    db.getfishes(1, (fishes) => {
      res.send(fishes);
    })
  });

  app.get('/editfish/:id', (req, res) => {
    res.locals.editing = true;
    if (req.isAuthenticated() && req.user.username === 'angel') {
      db.getfish(req.params.id, (fish) => {
        res.render('addfish', fish);
      });
    }
  });

  app.post('/createart', (req, res) => {
    if (req.isAuthenticated() && req.user.username === 'angel') {
      db.createart({ title: req.body.title, desc: req.body.description, thumbnail: req.body.thumbnail, data: req.body.data, id: req.body.id, date: req.body.date, author: req.body.author });
    }
    res.redirect('/creator')
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

  app.get('/delete/:id', (req, res) => {
      db.deleteUser(req.params.id, ()=> {
          res.redirect('/list');
      });
  });

  app.post('/login', mw.validateInfo, passport.authenticate('login', { session: true, successRedirect : '/', failureRedirect : '/login' }));

  app.get('/logout', (req, res) => {
     req.logout();
     req.user = 0;
     setTimeout(() => {
       res.redirect('/');
     }, 1000);
  });

  app.post('/saveMessage', (req, res) => {
      if(req.isAuthenticated()) {
        req.user.loggedIn = true;
        req.user.owner = true;
        req.user.saveMessage(req.body.message, () => {
          res.redirect('/');
        });
      }
  });

}
