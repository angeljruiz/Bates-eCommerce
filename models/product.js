let Persistent = require("../config/persistent.js");

class product extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.sku = input.sku || -1;
      this.name = input.name || "";
      this.price = input.price || 0;
      this.description = input.description || "";
      this.quantity = input.quantity || 0;
      this.type = input.type || "";
      this.store = input.store || 1;
      this.section = input.section || -1;
    } else {
      this.sku = -1;
      this.name = "";
      this.price = 0;
      this.description = "";
      this.quantity = 0;
      this.type = "";
      this.store = 1;
      this.section = -1;
    }
  }

  publicKey() {
    return ["sku", this.sku];
  }
}

module.exports = product;
