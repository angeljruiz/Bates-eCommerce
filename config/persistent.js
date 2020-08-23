let db = require("../scripts/database.js");

class Persistent {
  static async retrieve(pk, attrs = false) {
    let item = await db
      .getData(this, attrs ? attrs : "all", pk)
      .catch((e) => e);
    if (!item) return false;
    return item;
  }
  static customQuery(query) {
    return new Promise(async (resolve, reject) => {
      let item = await db.custom(this, query);
      resolve(item);
    });
  }
  publicKey() {
    return ["id", this.id];
  }
  values(attrs) {
    let values = [];
    attrs.forEach((item) => {
      values.push(this[item]);
    });
    return values;
  }
  async save(attrs, pk) {
    return new Promise(async (resolve, reject) => {
      let t = "";
      if (attrs && !Array.isArray(attrs)) {
        resolve(
          await db.saveData(
            this.constructor,
            Object.keys(attrs),
            pk,
            Object.values(attrs)
          )
        );
      } else {
        if (
          Object.getPrototypeOf(this.constructor).name &&
          Object.getPrototypeOf(this.constructor).name != "Persistent"
        ) {
          t = db.constructor.getJoinAttrs(this.constructor, attrs, false);
          let parentSuccess = await db.saveData(
            Object.getPrototypeOf(this.constructor),
            t,
            pk,
            db.constructor.getJoinData(this, t)
          );
          if (parentSuccess) {
            t = db.constructor.getJoinAttrs(this.constructor, attrs, true);
            resolve(
              await db.saveData(
                this.constructor,
                t,
                pk,
                db.constructor.getJoinData(this, t)
              )
            );
          }
        } else
          db.saveData(
            this.constructor,
            attrs ? attrs : Object.keys(this),
            pk,
            attrs ? this.values(attrs) : Object.values(this)
          )
            .then((data) => resolve(data))
            .catch((e) => reject(e));
      }
    });
  }
  async delete(fn) {
    if (
      Object.getPrototypeOf(this.constructor).name &&
      Object.getPrototypeOf(this.constructor).name != "Persistent"
    ) {
      await db.deleteData(this.constructor, this.publicKey());
      return await db.deleteData(
        Object.getPrototypeOf(this.constructor),
        this.publicKey()
      );
    } else {
      return await db.deleteData(this.constructor, this.publicKey());
    }
  }
}

module.exports = Persistent;
