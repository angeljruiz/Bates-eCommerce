let fs = require('fs');
let bcrypt = require('bcrypt-nodejs');

let Persistent = require('../config/persistent.js');

class users extends Persistent {
    constructor(input) {
      super();
      if (input) {
        this.username = input.username || 0;
        this.email = input.email || 0;
        this.password = input.password || 0;
        this.id = input.id || -1;
        this.pp = input.pp || 0;
      }
      this.username = 0;
      this.email = 0;
      this.password = 0;
      this.id = -1;
      this.pp = 0;
      return this;
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
