"use strict";

let Lock = require("../models/lock.js");
let Product = require("../models/product.js");

class Locker {
  constructor() {
    this.locks = [];
  }
  static loadResources(cart) {
    return new Promise((resolve, reject) => {
      let products = [];
      cart.forEach((item) => {
        products.push(Product.retrieve(["id", item.id], ["quantity", "id"]));
      });
      Promise.all(products).then((results) => {
        resolve(results);
      });
    });
  }
  removeIDLock(sid, id) {
    return new Promise(async (resolve, reject) => {
      let lock = await Lock.retrieve(["sid", sid, " AND id = " + id], false);
      if (!lock) return resolve();
      let product = await Product.retrieve(["id", id], ["quantity"]);
      let newProduct = new Product({
        id: id,
        quantity: parseInt(product.quantity) + parseInt(lock.amount),
      });
      await newProduct.save(["quantity"], newProduct.publicKey());
      lock.delete();
      resolve();
    });
  }
  lockResources(cart, sid) {
    return new Promise(async (resolve, reject) => {
      let locked = true;
      let items = [];
      let lockProducts = [];
      let locks = await Lock.retrieve(["sid", sid], false);
      let resources = await Locker.loadResources(cart.items, sid);
      let lockIndex, lockAmount, currentResource;
      if (!locks) locks = [];
      if (!Array.isArray(locks)) locks = [locks];
      locks = locks.filter((lock) => {
        if (
          !cart.items
            .map((cartItem) => {
              return cartItem.id;
            })
            .includes(lock.id)
        ) {
          Product.retrieve(["id", lock.id], ["quantity"]).then(
            async (product) => {
              let newProduct = new Product({
                id: lock.id,
                quantity: parseInt(product.quantity) + parseInt(lock.amount),
              });
              await newProduct.save(["quantity"], newProduct.publicKey());
              lock.delete();
            }
          );
          return false;
        }
        return true;
      });
      for (let index = 0; index < cart.items.length; index += 1) {
        let item = cart.items[index];
        lockIndex = locks
          .map((lock) => {
            return lock.id;
          })
          .indexOf(item.id);
        lockAmount = lockIndex != -1 ? locks[lockIndex].amount : 0;
        currentResource = resources[index];
        if (currentResource.quantity >= item.quantity - lockAmount) {
          if (lockIndex != -1) {
            if (lockAmount != item.quantity) {
              let newLock = new Lock({
                lid: locks[lockIndex].lid,
                amount: item.quantity,
              });
              let newProduct = new Product({
                id: item.id,
                quantity:
                  parseInt(currentResource.quantity) -
                  (item.quantity + lockAmount),
              });
              lockProducts.push(newLock);
              lockProducts.push(newProduct);
            }
          } else {
            let newLock = new Lock({
              sid: sid,
              id: item.id,
              amount: item.quantity,
            });
            let newProduct = new Product({
              id: item.id,
              quantity: parseInt(currentResource.quantity) - item.quantity,
            });
            lockProducts.push(newLock);
            lockProducts.push(newProduct);
          }
        } else {
          items.push({
            id: item.id,
            quantity: Math.abs(
              parseInt(currentResource.quantity) - item.quantity + lockAmount
            ),
          });
          locked = false;
        }
      }
      if (locked) {
        lockProducts.forEach((item) => {
          if (item.constructor.name === "lock")
            item.save(
              item.lid !== -1 ? ["lid", "amount"] : ["sid", "id", "amount"],
              item.lid !== -1 ? item.publicKey() : false
            );
          else item.save(["quantity"], item.publicKey());
        });
        resolve(true);
      } else {
        resolve(items);
      }
    });
  }
  async removeLocks() {
    let products = [];
    let locks = [];
    if (!locks) {
      return;
    }
    if (!Array.isArray(locks)) locks = [locks];
    locks.forEach((lock) => {
      products.push(Product.retrieve(["id", lock.id], false));
    });
    Promise.all(products).then((results) => {
      results.forEach(async (item, index) => {
        item.quantity = parseInt(item.quantity) + parseInt(locks[index].amount);
        await item.save(false, item.publicKey());
        locks[index].delete();
      });
    });
  }
}

module.exports = new Locker();
