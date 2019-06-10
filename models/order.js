let db = require('../scripts/database.js');
let MF = require('../models/marinefish.js');
let Cart = require('../models/cart.js');

class orders {
  constructor(input, cart, sid, fn) {
    if (input && cart && sid) {
      this.fn = input.fn;
      this.ln = input.ln;
      this.pn = input.pn;
      this.em = input.em;
      this.date = input.date;
      this.processing = true;
      this.sid = sid;
      this.cid = sid.slice(-5) + '-' + this.date.slice(-7, -3);
    } else {
      this.fn = this.ln = this.pn = this.em = this.date = this.processing = this.sid = this.cid = -1;
    }
    return this;
  }

  static save(order, cart, fn) {
    db.saveData(orders, Object.keys(order), false, Object.values(order), (err) => {
      let items = [];
      if (err) {
        return console.error('error saving order');
      }
      cart.items.forEach( (item, index) => {
        items.push(item.id);
        items.push(cart.amount[index]);
      });
      items = '{' + items + '}';
      db.saveData(Cart, ['cid', 'items'], false, [cart.cid, items], () => {
        return fn();
      });
    });
  }

}

module.exports = orders;
