"use strict";

var db = require('pg');
var config = { user: 'postgres', database: 'Sharkreef', password: 'mamadastacoslol', host: 'localhost', port: 5432, max: 10, idleTimeoutMillis: 30000 };
var pool = new db.Pool(config);

pool.on('error', function (err) {
    console.error('idle client error', err.message, err.stack);
});

module.exports.connect = function (callback) {
    return pool.connect(callback);
};



class Database {
    getData( model, attrs, pk, fn) {
      let c = new model;
      let d = [];
      let p = 0;
      let keys = Object.keys(c);
      let attributes = '';
      let query;
      if (attrs == 'all') {
        attributes = '*';
      } else {
        attrs.forEach( (item, index) => {
          attributes += item;
          if (index < attrs.length-1)
            attributes += ', ';
        });
      }
      query = 'SELECT ' + attributes + ' FROM ' + c.constructor.name + (pk == 'all'? '' : ' WHERE ' + pk[0] + ' = \'' + pk[1] + '\'');
      pool.query(query, (err, res) => {
        let rtr = function(item, index) {
          c[item] = res.rows[0][item];
        }
        if (err)
          return console.error('error running query', err);
        if (res.rows.length == 1) {
          if (attrs == 'all')
            keys.forEach ( rtr );
          else
            attrs.forEach( rtr );
        } else if (res.rows.length > 1) {
          res.rows.forEach( (item, index) => {
            d.push(new model);
            keys.forEach ( (key) => {
              d[p][key] = res.rows[index][key];
            });
            p++;
          });
        } else return fn(false);
        if (res.rows.length == 1)
          return fn(c);
        else if (res.rows.length >= 1)
          return fn(d);
      });
    }
    saveData(model, attrs, pk, input, fn) {
      let c = new model;
      let attributes = '';
      let data = '';
      let query;
      attrs.forEach( (item, index) => {
        attributes += item;
        if (index < attrs.length-1)
          attributes += ', ';
      });
      input.forEach ( (item, index) => {
        data += "'" + item + "'";
        if (index < input.length-1)
          data += ', ';
      });
      query = (pk == false? 'INSERT INTO ' : 'UPDATE ') + c.constructor.name + (pk == false? ' (': ' SET (') + attributes + (pk == false? ') VALUES (' : ') = (') + data + (pk != false? ') WHERE ' + pk[0] + ' = ' + pk[1] : ')');
      pool.query(query, (err) => {
        if (err)
          return console.error('error running query', err);
        return fn();
      });
    }
    deleteData(model, pk, fn) {
      let c = new model;
      let query = 'DELETE FROM ' + c.constructor.name + ' WHERE ' + pk[0] + ' = ' + pk[1];
      pool.query(query, (err) => {
        if(err)
            return console.error('error running query', err);
        return fn();
      });
    }

}

module.exports = new Database;
module.exports.pool = pool
