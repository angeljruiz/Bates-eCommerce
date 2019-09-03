let Product = require('../models/product.js');

class marinefish extends Product {
  constructor(fish) {
    super();
    if (!fish) {
      this.ag = this.rs = this.ming = -1;
      return this;
    }
    this.id = fish.id;
    this.name = fish.name;
    this.price = fish.price;
    this.description = fish.description;
    this.quantity = fish.quantity;
    this.ag = fish.ag;
    this.rs = fish.rs;
    this.ming = fish.ming;

    return this;
  }
  static variables() { return ['ag', 'rs', 'ming']; }

}

module.exports = marinefish;
