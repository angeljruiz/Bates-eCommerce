let Persistent = require('../config/persistent.js');
let Cart = require('../models/cart.js');

class orders extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.fn = input.fn;
      this.ln = input.ln;
      this.date = input.date;
      this.processing = input.processing || true;
      this.line1 = input.line1 || '';
      this.city = input.city || '';
      this.state = input.state || ''
      this.postal_code = input.postal_code || 0;
      this.shipped = input.shipped || false;
      this.finalized = input.finalized || false;
      this.cid = input.cid;
    } else {
      this.fn = this.ln = this.date = this.processing = this.line1 = this.city = this.state = this.shipped = this.postal_code = this.cid = this.finalized = -1;
    }
    return this;
  }

  static retrieve(pk, fn) {
    return new Promise( async (resolve, reject) => {
      let cart;
      let order = await super.retrieve(pk, false);
      if (!order) return resolve(false);
      if (order.cid) cart = await Cart.getCart(order.cid);
      if (!cart) return resolve(order);
      order.cart = cart;
      Cart.getTotal(order.cart);
      resolve(order);
    });
  }

  delete(fn) {
    let cart = new Cart({cid: this.cid});
    cart.delete( () => {
      super.delete(fn);
    });
  }

  publicKey() { return ['cid', this.cid]; }

}

module.exports = orders;
