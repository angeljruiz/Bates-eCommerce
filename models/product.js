let db = require('../scripts/database.js');

class product {
  constructor() {
    this.id = -1;
    this.name = '';
    this.price = 0;
    this.description = '';
    this.quantity = 0;
  }
  save(fn) {
    let pk = false;
    if (this.edit) {
      delete this.edit;
      pk = ['id', this.id];
    }
    db.saveData(product, ['id', 'name', 'price', 'description', 'quantity'], pk, [this.id, this.name, this.price, this.description, this.quantity], fn);
  }
  static getProduct(id, fn) {
    let c = new product();
    db.getData(product, 'all', ['id', id], (product) => {
      c.id = product.id;
      c.name = product.name;
      c.price = product.price;
      c.description = product.description;
      c.quantity = product.quantity;
      return fn(c);
    });
  }
}

module.exports = product;
