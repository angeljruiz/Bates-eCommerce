let db = require('../scripts/database.js');

class cart {
  constructor() {
    this.items = [];
    this.amount = [];
    this.total = 0;
    this.cid = -1;
  }

  static addItem(cart, item, amount) {
    let f = false;
    cart.items.forEach( (product, index) => {
      if(product.id == item.id) {
        f = true;
        cart.amount[index]++;
      }
    });
    if(!f) {
      cart.items.push(item);
      cart.amount.push(amount);
    }
  }

  static save (cart, fn) {
    db.saveCart(cart, (err) => {
      if (err)
        return console.log('error running query');
      return fn();
    });
  }

  static removeItem(cart, item, amount) {
    cart.items.forEach( (product, index) => {
      if(product.id == item) {
        cart.items.splice(index, 1);
        cart.amount.splice(index, 1);
      }
    });
  }

  static getTotal(cart) {
    let total = 0;
    for(let i=0;i<cart.items.length;i++)
      total += cart.items[i].price * 1 * cart.amount[i];
    cart.total = total.toFixed(2);
  }
}

module.exports = cart;
