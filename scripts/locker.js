'use strict';

let Lock = require('../models/lock.js');
let Product = require('../models/product.js');
let Session = require('../models/session.js');

class Locker {
  constructor() {
    this.locks = [];
  }
  static loadResources(cart, sid, fn) {
    return new Promise( (resolve, reject) => {
      let resources = [];
      let products = [];
      cart.forEach( (item, index) => {
        products.push(Product.retrieve(['sku', item.sku], ['quantity', 'sku']));
      });
      Promise.all(products).then( results => {
        resolve(results);
      });
    });
  }
  async removeSessionLocks(sid) {
    let locks = await Lock.retrieve(['sid', sid], false);
    if (Array.isArray(locks)) {
      locks.forEach( lock => {
        lock.delete();
      });
    } else if (locks) {
      locks.delete();
    }
  }
  removeIDLock(sid, sku) {
    return new Promise( async (resolve, reject) => {
      let lock = await Lock.retrieve(['sid', sid, ' AND SKU = ' + sku], false);
      if (!lock) return resolve();
      let product = await Product.retrieve(['SKU', sku], ['quantity']);
      let newProduct = new Product({sku: sku, quantity: parseInt(product.quantity) + parseInt(lock.amount)});
      newProduct.save(['quantity'], newProduct.publicKey());
      lock.delete();
      resolve();
    });
  }
  lockResources(cart, sid, fn) {
    return new Promise( async (resolve, reject) => {
      let locked = true;
      let items = [];
      let locks = await Lock.retrieve(['sid', sid], false);
      let resources = await Locker.loadResources(cart.items, sid);
      let newLock, newProduct;
      let lockIndex, lockAmount, currentResource;
      if (!locks) locks = [];
      if (!Array.isArray(locks)) locks = [locks];
      locks = locks.filter( lock => {
        if (!cart.items.map( cartItem => { return cartItem.sku }).includes(lock.sku)) {
          Product.retrieve(['sku', lock.sku], ['quantity']).then( product => {
            newProduct = new Product({sku: lock.sku, quantity: parseInt(product.quantity) + parseInt(lock.amount)});
            newProduct.save(['quantity'], newProduct.publicKey());
            lock.delete();
          });
          return false;
        }
        return true;
      });
      for(let index=0;index<cart.items.length;index+=1) {
        let item = cart.items[index];
        lockIndex = locks.map( lock => { return lock.sku }).indexOf(item.sku);
        lockAmount = lockIndex != -1? locks[lockIndex].amount : 0;
        currentResource = resources[index];
        if (currentResource.quantity >= item.quantity - lockAmount) {
          if (lockIndex != -1) {
            if (lockAmount != item.quantity) {
              newLock = new Lock({lid: locks[lockIndex].lid, amount: item.quantity});
              newLock.save(['lid', 'amount'], newLock.publicKey());
              newProduct = new Product({sku: item.sku, quantity: parseInt(currentResource.amount) - (item.quantity + lockAmount)});
              newProduct.save(['quantity'], newProduct.publicKey());
            }
          } else {
            newLock = new Lock({sid: sid, sku: item.sku, amount: item.quantity});
            newLock.save(['sid', 'sku', 'amount']);
            newProduct = new Product({sku: item.sku, quantity: parseInt(currentResource.amount) - item.quantity});
            newProduct.save(['quantity'], newProduct.publicKey());
          }
        } else {
          items.push({sku: item.sku, quantity: Math.abs(parseInt(currentResource.quantity) - item.quantity + lockAmount)});
          locked = false;
        }
        return resolve(locked? true : items);
      }
    });
  }
  async removeLocks() {
    let products = [];
    let locks = await Lock.customQuery('SELECT * FROM lock as lh LEFT JOIN session as rh on rh.sid = lh.sid');
    if (!locks) { return; }
    if (!Array.isArray(locks)) locks = [locks];
    locks.forEach( lock => {
      products.push(Product.retrieve(['sku', lock.sku], false));
    });
    Promise.all(products).then(results => {
      results.forEach( (item, index) => {
        item.quantity = parseInt(item.quantity) + parseInt(locks[index].amount);
        item.save(false, item.publicKey());
        locks[index].delete();
      });
    });
  }
}

module.exports = new Locker;
