var mailer = require('nodemailer');
var crypto = require('crypto');
var User = require('../models/user.js');
var mw = require('./middleware.js');

module.exports = (app, db, passport) => {

  app.get('/', (req, res) => {
    if(req.isAuthenticated()) {
      new User({ id: req.user.id }, (err, user) => {
        user.loggedIn = true;
        user.owner = true;
      });
    }
    console.log(req.session.cart);
    db.getfishes(1, (fishes) => {
      res.render('index', { fishes: fishes });
    });
  });

  app.get('/admin', (req, res) => {
    if (res.locals.aauth) {
      db.getfishes(3, (fishes) => {
        res.render('admin', { fishes: fishes });
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/list', (req, res) => {
    db.loadUsers( users => {
      res.render('list', { users: users, loggedIn: req.isAuthenticated() });
    });
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
    new User({ id: req.query.id, messages: true }, (err, user) => {
      if(err)
        return console.log(err);
      res.render('user', user.pageify(req));
    });
  });

};
