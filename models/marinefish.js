let db = require('../scripts/database.js');

class marinefish {
  constructor(id, fn) {
    if (!id) {
      this.id = this.description = this.ag = this.rs = this.ming = this.name = this.price = this.quantity = -1;
      if (fn)
        return fn(this);
      return;
    }
    db.getfish(id, (fish) => {
      this.id = fish.id;
      if (this.id === -1) {
        if (fn)
          return fn(this);
        else
          return;
      }
      this.description = fish.description;
      this.ag = fish.ag;
      this.rs = fish.rs;
      this.ming = fish.ming;
      this.name = fish.name;
      this.price = fish.price;
      this.quantity = fish.quantity;
    });
  }

}

module.exports = marinefish;
