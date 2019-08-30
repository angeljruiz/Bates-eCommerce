let db = require('../scripts/database.js');
let MF = require('../models/marinefish.js');
let Cart = require('../models/cart.js');

class orders {
  constructor(input) {
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

  static save(order, cart, fn) {
    let edit = order.edit;
    delete order.edit;
    db.saveData(orders, Object.keys(order), edit? ['cid', order.cid] : false, Object.values(order), (err) => {
      let items = [];
      if (err) {
        return console.error('error saving order');
      }
      cart.items.forEach( (item, index) => {
        items.push(item.id);
        items.push(cart.amount[index]);
      });
      items = '{' + items + '}';
      db.saveData(Cart, ['cid', 'items'], edit? ['cid', order.cid] : false, [order.cid, items], () => {
        if (fn)
          return fn();
      });
    });
  }

  static getOrder(cid, fn) {
    db.getData(orders, 'all', ['cid', cid], (order) => {
      if (!order) {
        if (fn)
          return fn(false);
        else return false;
      }
      Cart.getCart(cid, (cart) => {
        if (!cart)
          return fn(order);
        order.cart = cart;
        Cart.getTotal(order.cart);
        return fn(order);
      });
    });
  }

  static submit(order, fn) {
    order.processing = false;
    db.saveData(orders, ['processing'], ['cid', order.cid], [false], fn);
  }

}

module.exports = orders;
