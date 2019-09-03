'use strict';

let Persistent = require('../scripts/persistent.js');

class session extends Persistent {
  constructor(input) {
    super();
    this.sid = -1;
    return this;
  }
  publicKey() { return ['sid', this.sid]; }

}

module.exports = session;
