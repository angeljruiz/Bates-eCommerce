let Persistent = require("../config/persistent.js");

class product extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.id = input.id || -1;
      this.sku = input.sku || "";
      this.name = input.name || "";
      this.price = input.price || 0;
      this.description = input.description || "";
      this.quantity = input.quantity || 0;
      this.store = input.store || 1;
      this.section = input.section || -1;
    } else {
      this.id = -1;
      this.sku = "";
      this.name = "";
      this.price = 0;
      this.description = "";
      this.quantity = 0;
      this.store = 1;
      this.section = -1;
    }
  }

  publicKey() {
    return ["id", this.id];
  }
}

module.exports = product;
