let Persistent = require('../scripts/persistent.js');

class product extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.id = input.id || -1;
      this.name = input.name || '';
      this.price = input.price || 0;
      this.description = input.description || '';
      this.quantity = input.quantity || 0;
      this.edit = input.edit == true;
    } else {
      this.id = -1;
      this.name = '';
      this.price = 0;
      this.description = '';
      this.quantity = 0;
    }
  }
}

module.exports = product;
