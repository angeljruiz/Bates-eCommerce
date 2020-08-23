let Persistent = require("../config/persistent.js");

class store extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.id = input.id || -1;
      this.name = input.name || "";
      this.url = input.url || "";
      this.paid = input.paid || -1;
      this.price = input.price || -1;
    } else this.id = this.name = this.url = this.paid = this.price = -1;
  }
}

module.exports = store;
