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
        results.forEach( product => {
          let t = {};
          t.sku = product.sku;
          t.amount = product.quantity;
          resources.push(t);
        });
        resolve(resources);
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
      let newProduct = new Product({sku: sku, quantity: parseInt(product.quantity) + parseInt(lock.amount), edit:true });
      newProduct.save(['quantity']);
      lock.delete();
      resolve();
    });
  }
  lockResources(cart, sid, fn) {
    return new Promise( async (resolve, reject) => {
      let locked = true;
      let items = [];
      let resources = Locker.loadResources(cart.items, sid);
      let locks = await Lock.retrieve(['sid', sid], false);
      let newLock, newProduct;
      let lockIndex, lockAmount, currentResource;
      if (!locks) locks = [];
      if (!Array.isArray(locks)) locks = [locks];
      locks.forEach( lock => {
        if (!cart.items.map( cartItem => { return cartItem.sku }).includes(lock.sku)) {
          Product.retrieve(['sku', lock.sku], ['quantity']).then( product => {
            newProduct = new Product({sku: lock.sku, quantity: parseInt(product.quantity) + parseInt(lock.amount), edit:true });
            newProduct.save(['quantity']);
            lock.delete();
          });
        }});
      cart.items.forEach( async (item, index) => {
        lockIndex = locks.map( lock => { return lock.sku }).indexOf(item.sku);
        lockAmount = lockIndex != -1? locks[lockIndex].amount : 0;
        currentResource = (await resources).filter( resource => { if (resource.sku == item.sku) return true; })[0];
        if (currentResource.amount >= cart.amount[index] - lockAmount) {
          if (lockIndex != -1) {
            if (lockAmount != cart.amount[index]) {
              newLock = new Lock({lid: locks[lockIndex].lid, amount: cart.amount[index], edit: true});
              newLock.save(['lid', 'amount']);
              newProduct = new Product({sku: item.sku, quantity: parseInt(currentResource.amount) - cart.amount[index] + lockAmount, edit: true});
              newProduct.save(['quantity']);
            }
          } else {
            newLock = new Lock({sid: sid, sku: item.sku, amount: cart.amount[index]});
            newLock.save(['sid', 'sku', 'amount']);
            newProduct = new Product({sku: item.sku, quantity: parseInt(currentResource.amount) - cart.amount[index], edit: true});
            newProduct.save(['quantity']);
          }
          if (index == cart.items.length-1) return resolve(locked? true : items);
          return;
        }
        items.push({sku: item.sku, amount: Math.abs(parseInt(currentResource.amount) - cart.amount[index] + lockAmount)});
        locked = false;
        if (index == cart.items.length-1) return resolve(locked? true : items);
      });
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
        item.save();
        locks[index].delete();
      });
    });
  }
}

module.exports = new Locker;
