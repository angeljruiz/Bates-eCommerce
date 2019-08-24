let db = require('../scripts/database.js');
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
  save(fn) {
    let edit = this.edit;
    super.save( () => {
      let pk = false;
      if (edit)
        pk = ['id', this.id];

      db.saveData(marinefish, ['id', 'ag', 'rs', 'ming'], pk, [this.id, this.ag, this.rs, this.ming], fn);
    });
  }
  static getProduct(id, fn) {
    db.getData(marinefish, 'all', ['id', id], (fish) => {
      return fn(fish);
    });
  }
  static variables() { return ['ag', 'rs', 'ming']; }

}

module.exports = marinefish;
