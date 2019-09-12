'use strict';

let Lock = require('../models/lock.js');
let Product = require('../models/product.js');
let Session = require('../models/session.js');

class Locker {
  constructor() {
    this.locks = [];
  }
  static loadResources(cart, sid, fn) {
    let amounts = [];
    cart.forEach( (item, index) => {
      Product.retrieve(['id', item.id], ['quantity'], product => {
        let t = {};
        t.id = item.id;
        t.amount = product.quantity;
        amounts.push(t);
        if (index == cart.length-1) {
          return fn(amounts);
        }
      });
    });
  }
  removeSessionLocks(sid) {
    Lock.retrieve(['sid', sid], false, locks => {
      if (Array.isArray(locks)) {
        locks.forEach( lock => {
          lock.delete();
        });
      } else if (locks) {
        locks.delete();
      }
    });
  }
  removeIDLock(sid, id) {
    return new Promise( (resolve, reject) => {
      Lock.retrieve(['sid', sid, ' AND ID = ' + id], false, lock => {
        if (!lock) return resolve();
        Product.retrieve(['id', id], ['quantity'], product => {
          let newProduct = new Product({id: id, quantity: parseInt(product.quantity) + parseInt(lock.amount), edit:true });
          newProduct.save(['quantity']);
          lock.delete();
          resolve();
        });
      });
    });
  }
  lockResources(cart, sid, fn) {
    let locked = true;
    let items = [];
    Locker.loadResources(cart.items, sid, resources => {
      Lock.retrieve(['sid', sid], false, locks => {
        let newLock, newProduct;
        let lockIndex, lockAmount, currentResource;
        if (!locks) locks = [];
        if (!Array.isArray(locks)) locks = [locks];
        locks.forEach( lock => {
          if (!cart.items.map( cartItem => { return cartItem.id }).includes(lock.id)) {
            Product.retrieve(['id', lock.id], ['quantity'], product => {
              newProduct = new Product({id: lock.id, quantity: parseInt(product.quantity) + parseInt(lock.amount), edit:true });
              newProduct.save(['quantity']);
            });
            lock.delete();
          }});
        cart.items.forEach( (item, index) => {
          lockIndex = locks.map( lock => { return lock.id }).indexOf(item.id);
          lockAmount = lockIndex != -1? locks[lockIndex].amount : 0;
          currentResource = resources.filter( resource => { if (resource.id == item.id) return true; })[0];
          if (currentResource.amount >= cart.amount[index] - lockAmount) {
            if (lockIndex != -1) {
              if (lockAmount != cart.amount[index]) {
                newLock = new Lock({lid: locks[lockIndex].lid, amount: cart.amount[index], edit: true});
                newLock.save(['lid', 'amount']);
                newProduct = new Product({id: item.id, quantity: parseInt(currentResource.amount) - cart.amount[index] + lockAmount, edit: true});
                newProduct.save(['quantity']);
              }
            } else {
              newLock = new Lock({sid: sid, id: item.id, amount: cart.amount[index]});
              newLock.save(['sid', 'id', 'amount']);
              newProduct = new Product({id: item.id, quantity: parseInt(currentResource.amount) - cart.amount[index], edit: true});
              newProduct.save(['quantity']);
            }
            if (index == cart.items.length-1) return fn(locked? true : items);
            return;
          }
          items.push({id: item.id, amount: Math.abs(parseInt(currentResource.amount) - cart.amount[index] + lockAmount)});
          locked = false;
          if (index == cart.items.length-1) return fn(locked? true : items);
        });
      });
    });
  }
  removeLocks() {
    Lock.customQuery('SELECT * FROM lock as lh LEFT JOIN session as rh on rh.sid = lh.sid WHERE rh.sid IS NULL', locks => {
      if (!locks) { return; }
      if (!Array.isArray(locks)) locks = [locks];
      locks.forEach( lock => {
        Product.retrieve(['id', lock.id], false, item => {
          item.quantity = parseInt(item.quantity) + parseInt(lock.amount);
          item.save();
        });
        lock.delete();
      });
    });
  }
}

module.exports = new Locker;
