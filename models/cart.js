let Persistent = require('../scripts/persistent.js');
let Product = require('./product.js');

class cart extends Persistent {
  constructor(input) {
    super();
    if (!input) {
    this.items = [];
    this.amount = [];
    this.subtotal = 0;
    this.cid = -1;
  } else {
    this.items = input.items;
    this.amount = input.amount;
    this.cid = input.cid;
  }
  return this;
  }

  static addItem(cart, item, amount, Order, rtr) {
    let f = false;
    cart.items.forEach( (product, index) => {
      if (product.id == item.id) {
        f = true;
        cart.amount[index] += amount;
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
    cart.subtotal = total.toFixed(2);
    cart.salestax = 0;
    cart.shipping = cart.subtotal > 0? 6.99 : 0.00;
    cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.salestax) + cart.shipping).toFixed(2);
  }

  static getCart(cid, fn) {
    let c = new cart;
    c.cid = cid;
    cart.retrieve(['cid', cid], false, ct => {
      if (!ct || ct.items.length == 2) return fn(false);
      let items = ct.items.slice(1,-1).split(',');
      let len = items.length != 2? items.length/2 : items.length-1;
      for(let i=0;i<len;i++) {
        Product.retrieve(['id', items[i*2]], false, product => {
          c.items.push(product);
          c.amount.push(items[i*2+1]);
          if (i == len-1)
            return fn(c);
        });
      }
    });
  }

  publicKey() { return ['cid', this.cid]; }

  save(fn) {
    let items = [];
    this.items.forEach( (item, index) => {
      items.push(item.id);
      items.push(this.amount[index]);
    });
    items = '{' + items + '}';
    super.save({items:items, cid: this.cid}, fn);
  }

}

module.exports = cart;
