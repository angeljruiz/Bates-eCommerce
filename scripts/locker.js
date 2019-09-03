'use strict';

let Lock = require('../models/lock.js');
let Product = require('../models/product.js');
let Session = require('../models/session.js');

class Locker {
  constructor() {
    this.locks = [];
  }
  lockResources(cart, sid, fn) {
    cart.items.forEach( (item, index) => {
      Product.retrieve( ['id', item.id], false, product => {
        if (product.quantity - cart.amount[index] >= 0) {
          let lock = new Lock(sid, item.id, cart.amount[index]);
          product.quantity -= cart.amount[index];
          product.save( false, () => {
            this.locks.push(lock);
            lock.save(['sid', 'id', 'amount'], fn);
          });
        } else return fn(false);
      });
    });
  }
  removeLocks() {
    Lock.retrieve(false, false, locks => {
      if (!locks) return;
      let amount, sid, id = 0;
      sid = locks.sid;
      id = locks.id;
      amount = locks.amount;
      let func = function() {
         Session.retrieve(['sid', sid], ['sid'], session => {
          if (!session) {
            Product.retrieve(['id', id], false, item => {
              item.quantity = parseInt(item.quantity) + amount;
              item.save();
              let lock = new Lock(sid, id, amount);
              lock.delete();
            });
          }
        });
      }
      if (Array.isArray(locks)) {
        locks.forEach( (lock, index) => {
          sid = lock.sid;
          id = lock.id;
          amount = lock.amount;
          func();
        });
      } else func();
    });
  }
}

module.exports = new Locker;
