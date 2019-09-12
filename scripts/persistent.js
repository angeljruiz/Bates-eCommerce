let db = require('../scripts/database.js');

class Persistent {
  static retrieve(pk, attrs=false, fn) {
    db.getData(this, attrs? attrs : 'all', pk, item => {
      if (!item) return fn(false);
      item.edit = true;
      if (fn)
        fn(item);
    });
  }
  static customQuery(query, fn) {
    db.custom(this, query, item => {
      fn(item);
    });
  }
  publicKey() { return ['id', this.id]; }
  values(attrs) {
    let values = [];
    attrs.forEach( item => {
      values.push(this[item]);
    });
    return values;
  }
  save(attrs, fn) {
    let pk = false;
    let t = '';
    if (this.edit) {
      delete this.edit;
      pk = this.publicKey();
    }
    if (attrs && !Array.isArray(attrs)) {
      db.saveData(this.constructor, Object.keys(attrs), pk, Object.values(attrs), fn);
    } else {
      if (Object.getPrototypeOf(this.constructor).name && Object.getPrototypeOf(this.constructor).name != 'Persistent') {
        t = db.constructor.getJoinAttrs(this.constructor, attrs, false);
        db.saveData(Object.getPrototypeOf(this.constructor), t, pk, db.constructor.getJoinData(this, t), () => {
          t = db.constructor.getJoinAttrs(this.constructor, attrs, true);
          db.saveData(this.constructor, t, pk, db.constructor.getJoinData(this, t), fn);
        });
      } else
        db.saveData(this.constructor, attrs? attrs : Object.keys(this), pk, attrs? this.values(attrs) : Object.values(this), fn);
    }
  }
  delete(fn) {
    if (Object.getPrototypeOf(this.constructor).name && Object.getPrototypeOf(this.constructor).name != 'Persistent') {
      db.deleteData(this.constructor, this.publicKey(), () => {
        db.deleteData(Object.getPrototypeOf(this.constructor), this.publicKey(), fn);
      });
    } else {
      db.deleteData(this.constructor, this.publicKey(), fn);
    }
  }
}

module.exports = Persistent;
