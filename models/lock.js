'use strict';

let Persistent = require('../config/persistent.js');

class lock extends Persistent{
  constructor(input) {
    super();
    if (input) {
      this.lid = input.lid || -1;
      this.sid = input.sid || -1;
      this.sku = input.sku || -1;
      this.amount = input.amount || -1;
      this.edit = input.edit || false;
    } else {
      this.lid = this.sid = this.sku = this.amount = -1;
    }
    return this;
  }
  publicKey() { return ['lid', this.lid]; }

}

module.exports = lock;
