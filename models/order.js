let Persistent = require("../config/persistent.js");

class orders extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.fn = input.fn || "";
      this.ln = input.ln || "";
      this.date = input.date;
      this.line1 = input.line1 || "";
      this.line2 = input.line2 || "";
      this.city = input.city || "";
      this.state = input.state || "";
      this.postal_code = input.postal_code || 0;
      this.shipped = input.shipped || false;
      this.finalized = input.finalized || false;
      this.cart = input.cart || "";
      this.id = input.id || -1;
      this.store = input.store || -1;
    } else {
      this.fn = this.ln = this.date = this.line1 = this.line2 = this.city = this.state = this.shipped = this.postal_code = this.id = this.store = this.cart = this.finalized = -1;
    }
    return this;
  }

  publicKey() {
    return ["id", this.id];
  }
}

module.exports = orders;
