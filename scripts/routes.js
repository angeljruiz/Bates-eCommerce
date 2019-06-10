var mailer = require('nodemailer');
var crypto = require('crypto');
var User = require('../models/user.js');
var MF = require('../models/marinefish.js');
var Order = require('../models/order.js');
var mw = require('./middleware.js');

module.exports = (app, db, passport) => {

  app.get('/', (req, res) => {
    if(req.isAuthenticated()) {
      new User( ['id', req.user.id], (user, err) => {
        user.loggedIn = true;
        user.owner = true;
      });
    }
    db.getData(MF, ['id', 'price', 'name'], 'all', (fish) => {
      res.render('index', { fishes: fish });
    });
  });

  app.get('/admin', (req, res) => {
    if (res.locals.aauth) {
      db.getData(MF, ['id', 'name'], 'all', (fishes) => {
        res.render('admin', { fishes: fishes });
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/review', (req, res) => {
    db.getData(Order, 'all', ['cid', req.session.cart.cid], (order) => {
      res.render('review', order);
    });
  });

  app.get('/viewfish=:id', (req, res) => {
    db.getData(MF, 'all', ['id', req.params.id], (fish)=> {
      console.log(fish);
      res.render('viewfish', fish);
    });
  });

  app.get('/editfish/:id', (req, res) => {
    res.locals.editing = true;
    if (req.isAuthenticated() && req.user.username === 'angel') {
      db.getData(MF, 'all', ['id', req.params.id], (fish) => {
        res.render('addfish', fish);
      });
    }
  });

  app.get('/editor/:id', (req, res) => {
    res.locals.editing = true;
    if (!req.isAuthenticated() || req.user.username !== 'angel')
      return res.redirect('/');
    db.loadArticle(req.params.id, data => {
      if (data)
        for (let prop in data)
          res.locals[prop] = data[prop];
      res.locals.id = req.params.id;
      if (res.locals.date === '-1')
        res.locals.date = mw.formatDate(new Date());
      res.render('creator');
    });
  });

  app.get('/user', mw.isLoggedOn, (req, res) => {
    new User( ['id', req.query.id], (user, err) => {
      if(err)
        return console.log(err);
      res.render('user', user.pageify(req));
    });
  });

};
