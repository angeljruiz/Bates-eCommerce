let Persistent = require("../config/persistent.js");

class section extends Persistent {
  constructor(input) {
    super();
    if (input) {
      this.num = input.num || -1;
      this.name = input.name || "";
      this.id = input.id || -1;
      this.store = input.store || -1;
    } else this.num = this.name = this.id = this.store = -1;
  }

  publicKey() {
    return ["id", this.id];
  }
}

module.exports = section;
