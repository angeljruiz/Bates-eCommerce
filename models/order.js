let Persistent = require('../scripts/persistent.js');
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
    super.retrieve(pk, false, order => {
      if (!order) {
        if (fn)
          return fn(false);
        else return false;
      }
      Cart.getCart(order.cid, cart => {
        if (!cart)
          return fn(order);
        order.cart = cart;
        Cart.getTotal(order.cart);
        return fn(order);
      });
    });
  }

  publicKey() { return ['cid', this.cid]; }

}

module.exports = orders;
