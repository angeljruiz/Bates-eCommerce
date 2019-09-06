'use strict';

let Persistent = require('../scripts/persistent.js');

class lock extends Persistent{
  constructor(input) {
    super();
    if (input) {
      this.lid = input.lid || -1;
      this.sid = input.sid || -1;
      this.id = input.id || -1;
      this.amount = input.amount || -1;
      this.edit = input.edit || false;
    } else {
      this.lid = this.sid = this.id = this.amount = -1;
    }
    return this;
  }
  publicKey() { return ['lid', this.lid]; }

}

module.exports = lock;
