let db = require('../scripts/database.js');
let MF = require('../models/marinefish.js');
let Cart = require('../models/cart.js');

class orders {
  constructor(input, sid) {
    if (input && sid) {
      this.fn = input.fn;
      this.ln = input.ln;
      this.pn = input.pn;
      this.em = input.em;
      this.date = input.date;
      this.processing = true;
      this.sid = sid;
      this.pd = input.pd;
      this.finalized = false;
      this.cid = sid.slice(-5) + '-' + this.date.slice(-8, -3);
    } else {
      this.fn = this.ln = this.pn = this.em = this.date = this.processing = this.sid = this.cid = this.pd = this.finalized = -1;
    }
    return this;
  }

  static save(order, cart, fn) {
    let edit = order.edit;
    delete order.edit;
    db.saveData(orders, Object.keys(order), edit? ['cid', cart.cid] : false, Object.values(order), (err) => {
      let items = [];
      if (err) {
        return console.error('error saving order');
      }
      cart.items.forEach( (item, index) => {
        items.push(item.id);
        items.push(cart.amount[index]);
      });
      items = '{' + items + '}';
      db.saveData(Cart, ['cid', 'items'], edit? ['cid', cart.cid] : false, [cart.cid, items], () => {
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
