let fs = require('fs');
let bcrypt = require('bcrypt-nodejs');
let db = require('../scripts/database.js');

class users {
    constructor(input, fn) {
      this.username = 0;
      this.email = 0;
      this.password = 0;
      this.id = -1;
      this.pp = 0;
      if (input)
        return db.getData(users, 'all', input, fn);
      else if (fn)
        return fn(this);
    }
    pageify(req) {
      if (req.isAuthenticated())
        this.loggedIn = true;
      if (req.query.id === req.user.id)
        this.owner = true;
      else
        this.owner = false;
      return this;
    }
    generateHash(password) {
        this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

}

module.exports = users;
