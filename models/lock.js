'use strict';

let Persistent = require('../scripts/persistent.js');

class lock extends Persistent{
  constructor(sid, id, amount) {
    super();
    this.lid = -1;
    this.sid = sid;
    this.id = id;
    this.amount = amount;
  }
}

module.exports = lock;
