let Persistent = require("../config/persistent.js");
let Cart = require("../models/cart.js");

class orders extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.fn = input.fn;
      this.ln = input.ln;
      this.date = input.date;
      this.processing = input.processing || true;
      this.line1 = input.line1 || "";
      this.city = input.city || "";
      this.state = input.state || "";
      this.postal_code = input.postal_code || 0;
      this.shipped = input.shipped || false;
      this.finalized = input.finalized || false;
      this.cid = input.cid;
    } else {
      this.fn = this.ln = this.date = this.processing = this.line1 = this.city = this.state = this.shipped = this.postal_code = this.cid = this.finalized = -1;
    }
    return this;
  }

  static retrieve(pk) {
    return new Promise(async (resolve, reject) => {
      let cart;
      let order = await super.retrieve(pk, false);
      if (!order) return resolve(false);
      if (order.cid) cart = await Cart.retrieve(["cid", order.cid]);
      if (!cart) return resolve(order);
      order.cart = cart;
      Cart.getTotal(order.cart);
      resolve(order);
    });
  }

  async delete() {
    let cart = new Cart({ cid: this.cid });
    await cart.delete();
    return await super.delete();
  }

  async save(attrs, pk) {
    delete this.cart;
    return await super.save(attrs, pk);
  }

  publicKey() {
    return ["cid", this.cid];
  }
}

module.exports = orders;
