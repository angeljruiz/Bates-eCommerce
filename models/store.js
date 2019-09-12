let Persistent = require('../scripts/persistent.js');

class store extends Persistent {
  constructor(input) {
    if (input) {
      this.id = input.id || -1;
      this.name input.name || '';
      this.url = input.url || '';
      this.email = input.email || '';
      this.paid = input.paid || -1;
    } else this.id = this.name = this.url = this.email = this.paid = -1;
  }
}

module.export = store;
