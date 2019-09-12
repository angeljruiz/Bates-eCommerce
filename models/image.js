'use strict';

let Persistent = require('../scripts/persistent.js');

class image extends Persistent{
  constructor(input) {
    super();
    if (input) {
      this.data = input.data || null;
      this.id = input.id || -1;
      this.name = input.name || null;
      this.num = input.num || null;
      this.type = input.type || null;
      if (input.edit) this.edit = true;
    } else {
      this.data = this.id = this.num = this.name = this.type = -1;
    }
    return this;
  }
  publicKey() { return ['name', this.name]; }

}

module.exports = image;
