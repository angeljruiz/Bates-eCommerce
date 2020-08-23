let bcrypt = require("bcrypt-nodejs");

let Persistent = require("../config/persistent.js");

class users extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.username = input.username || 0;
      this.email = input.email || 0;
      this.password = input.password || 0;
      this.id = input.id || -1;
      this.role = input.role || "";
    } else {
      this.username = 0;
      this.email = 0;
      this.password = 0;
      this.id = -1;
      this.role = "";
    }
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
