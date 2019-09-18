let Product = require('../models/product.js');

class marinefish extends Product {
  constructor(fish) {
    super(fish);
    if (!fish) {
      this.ag = this.rs = this.ming = -1;
      return this;
    }
    this.ag = fish.ag;
    this.rs = fish.rs;
    this.ming = fish.ming;

    return this;
  }
  static variables() { return ['ag', 'rs', 'ming']; }

}

module.exports = marinefish;
