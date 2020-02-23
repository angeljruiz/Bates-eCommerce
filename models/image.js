'use strict';

let Persistent = require('../config/persistent.js');

class image extends Persistent{
  constructor(input) {
    super();
    if (input) {
      this.data = input.data || null;
      this.sku = input.sku || -1;
      this.name = input.name || null;
      this.num = input.num || null;
      this.type = input.type || null;
      this.data = input.data || null;
      if (input.edit) this.edit = true;
    } else {
      this.data = this.sku = this.num = this.name = this.type = this.data = -1;
    }
    return this;
  }
  publicKey() { return ['name', this.name]; }

}

module.exports = image;
