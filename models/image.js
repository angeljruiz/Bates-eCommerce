"use strict";

let Persistent = require("../config/persistent.js");

class image extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.url = input.url || null;
      this.id = input.id || -1;
      this.name = input.name || null;
      this.num = input.num || null;
      this.type = input.type || null;
      this.url = input.url || null;
      this.product = input.product || -1;
    } else {
      this.url = this.id = this.num = this.name = this.type = this.product = -1;
    }
    return this;
  }
  publicKey() {
    return ["id", this.id];
  }
}

module.exports = image;
