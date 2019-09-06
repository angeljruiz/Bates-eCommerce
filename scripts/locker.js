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
  lockResources(cart, sid, fn) {
    let locked = true;
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
                newProduct = new Product({id: item.id, quantity: parseInt(currentResource.amount) - parseInt(cart.amount[index]) + parseInt(lockAmount), edit: true});
                newProduct.save(['quantity']);
              }
            } else {
              newLock = new Lock({sid: sid, id: item.id, amount: cart.amount[index]});
              newLock.save(['sid', 'id', 'amount']);
              newProduct = new Product({id: item.id, quantity: parseInt(currentResource.amount) - parseInt(cart.amount[index]), edit: true});
              newProduct.save(['quantity']);
            }
            return;
          }
          locked = false;
        });
      });
    });
    return fn(false);
  }
  removeLocks() {
    Lock.retrieve(false, false, locks => {
      if (!locks) return;
      let amount, sid, id, lid;
      sid = locks.sid;
      id = locks.id;
      amount = locks.amount;
      lid = locks.lid;
      let func = function(sid, id, amount, lid) {
         Session.retrieve(['sid', sid], ['sid'], session => {
          if (!session) {
            Product.retrieve(['id', id], false, item => {
              item.quantity = parseInt(item.quantity) + parseInt(amount);
              item.save();
              let lock = new Lock({lid: lid});
              lock.delete();
            });
          }
        });
      }
      if (Array.isArray(locks)) {
        locks.forEach( lock => {
          sid = lock.sid;
          id = lock.id;
          amount = lock.amount;
          lid = lock.lid;
          func(sid, id, amount, lid);
        });
      } else func(sid, id, amount, lid);
    });
  }
}

module.exports = new Locker;
