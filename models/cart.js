let Persistent = require('../config/persistent.js');
let Product = require('./product.js');

class cart extends Persistent {
  constructor(input) {
    super();
    if (!input) {
      this.items = [];
      this.subtotal = 0;
      this.cid = -1;
    } else {
      this.items = input.items;
      this.cid = input.cid;
    }
  return this;
  }

  static addItem(cart, item, amount) {
    item.quantity = amount;
    let itemIndex = cart.items.findIndex( i => i.sku === item.sku);
    if(itemIndex > -1) cart.items[itemIndex].quantity += 1
    else cart.items.push(item);
  }

  static removeItems(cart, items) {
    items.forEach( item => {
      let itemIndex = cart.items.findIndex( i => i.sku === item.sku);
      if(itemIndex > -1) {
        if(cart.items[itemIndex].quantity - item.quantity <= 0) cart.items = cart.items.filter( i => i.sku !== item.sku)
        else cart.items[itemIndex].quantity -= item.quantity;
      }
    });
  }

  static getTotal(cart) {
    let total = cart.items.reduce( (sum, item) => sum + (item.price * item.quantity), 0);
    cart.totalItems = cart.items.reduce( (sum, item) => sum + item.quantity, 0);
    cart.subtotal = total.toFixed(2);
    cart.salestax = 0;
    cart.shipping = cart.subtotal > 0? 6.99 : 0.00;
    cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.salestax) + cart.shipping).toFixed(2);
  }

  static getCart(cid, fn) {
    return new Promise( async (resolve, reject) => {
      let c = new cart;
      let productsProm = [];
      c.cid = cid;
      let ct = await cart.retrieve(['cid', cid], false);
      if (!ct || ct.items.length == 2) return fn(false);
      let items = ct.items.slice(1,-1).split(',');
      let len = items.length != 2? items.length/2 : items.length-1;
      for(let i=0;i<len;i++) {
        productsProm.push(Product.retrieve(['sku', items[i*2]], false));
      }
      Promise.all(productsProm).then( products => {
        products.forEach( (product, index) => {
          c.items.push(product);
          c.amount.push(items[index*2+1]);
        });
        resolve(c);
      });
    });
  }

  publicKey() { return ['cid', this.cid]; }

  save(fn) {
    super.save({items:JSON.stringify(this.items), cid: this.cid}, fn);
  }

}

module.exports = cart;
