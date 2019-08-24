let db = require('../scripts/database.js');
let Product = require('../models/product.js');
class cart {
  constructor() {
    this.items = [];
    this.amount = [];
    this.total = 0;
    this.cid = -1;
  }

  static addItem(cart, item, amount, Order, rtr) {
    let f = false;
    cart.items.forEach( (product, index) => {
      if (product.id == item.id) {
        f = true;
        cart.amount[index] = amount;
      }
    });
    if (!f) {
      cart.items.push(item);
      cart.amount.push(amount);
    }
    if (cart.cid != -1) {
      Order.getOrder(cart.cid, (order) => {
        if (!order)
          return console.error('error saving cart');
        delete order.cart;
        order.edit = true;
        Order.save(order, cart, rtr);
      });
    } else return rtr();
  }

  static getItems(cart, fn) {
    let items = [];
    cart.items.forEach( (item) => {
      db.getData(MF, ['id', ''])
    });
  }

  static removeItem(cart, item, amount, Order, rtr) {
    cart.items.forEach( (product, index) => {
      if (product.id == item) {
        cart.items.splice(index, 1);
        cart.amount.splice(index, 1);
      }
    });
    if (cart.cid != -1) {
      Order.getOrder(cart.cid, (order) => {
        if (!order)
          return console.error('error saving cart');
        delete order.cart;
        order.edit = true;
        Order.save(order, cart, rtr);
      });
    } else return rtr();
  }

  static getTotal(cart) {
    let total = 0;
    for(let i=0;i<cart.items.length;i++)
      total += cart.items[i].price * 1 * cart.amount[i];
    cart.total = total.toFixed(2);
  }

  static getCart(cid, fn) {
    let c = new cart;
    c.cid = cid;
    db.getData(cart, 'all', ['cid', cid], (ct) => {
      let len = ct.items.length;
      for(let i=1;i<len;i+=4) {
        Product.getProduct(ct.items[i], (product) => {
          c.items.push(product);
          c.amount.push(ct.items[i+2]);
          if (i == len-4)
            return fn(c);
        });
      }
    });
  }

}

module.exports = cart;
