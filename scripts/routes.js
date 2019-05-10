//var mw = require('./middleware.js');

module.exports = (app, db) => {

  app.use((req, res, next) => {
    //pager.update(req);
    next();
  });

  app.get('/', (req, res) => {
    res.render('index');
  });


};
