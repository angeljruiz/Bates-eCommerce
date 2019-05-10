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
    constructor() {
        this.users = [];
        this.messages = [];
    }
    loadUsers(fn) {
        this.users = [];
        pool.query('SELECT * FROM users', (err, res) => {
            if(err)
                return console.error('error running query', err);
            for(let i=0;i<res.rows.length;i++)
                this.users.push({ name: res.rows[i].username, id: res.rows[i].id });
            fn(this.users);
        });
    }
    selectUser(user, fn) {
        let temp = (err, res) => {
            if(err) {
                return fn(err);
            }
            if(res.rows.length > 0)
                return fn(false, { username: res.rows[0].username, password: res.rows[0].password, id: res.rows[0].id, pp: res.rows[0].pp });
            else
                return fn(false, false);
        };
        if (user.localId !== -1) {
          pool.query('SELECT * FROM users WHERE id = ($1)', [user.localId], temp);
        } else if (user.localUsername !== 0) {
          pool.query('SELECT * FROM users WHERE username = ($1)', [user.localUsername], temp);
        } else if (user.localEmail !== 0) {
          pool.query('SELECT * FROM users WHERE email = ($1)', [user.localEmail], temp);
        }

    }
    loadPassword(id) {
      return new Promise( (resolve, reject) => {
        pool.query('SELECT password FROM users WHERE id = ($1)', [id], (err, res) => {
          if (err)
            return reject(err);
          resolve(res.rows[0].password);
        });
      });
    }
    deleteUser(id, fn) {
        pool.query('DELETE FROM users WHERE id = ($1)', [id], (err, res) => {
            if(err)
                return fn(err);

            return fn(true);
        });
    }
    createUser(username, email, password, fn) {
        if(username  === '' || password === '' || email === '') {
            return res.send('bad username or pass');
        }
        pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password], function(err) {
            if(err) {
                return console.error('error running query', err);
            }
            if (fn)
              fn();
        });
    }
    loadMessages(oid, fn) {
      this.messages = [];
      pool.query('SELECT * FROM messages WHERE oid = ($1) ORDER BY id DESC', [oid], (err, res) => {
        if(err)
          return console.error('error running query', err);
        for(let i=0;i<res.rows.length;i++)
          this.messages.push({ id: res.rows[i].id, text: res.rows[i].message });
        return fn(this.messages);
      });
    }
    saveMessage(oid, message, fn) {
      pool.query('INSERT INTO messages (message, oid) VALUES ($1, $2)', [message, oid], (err, res) => {
          if(err)
              return console.error('error running query', err);
          fn();
      });
    }
    uploadMedia(filename, data, fn) {
      pool.query('INSERT INTO media (filename, data) VALUES ($1, $2)', [filename, data], (err, res) => {
        if (err)
          return console.error('Error running query', err);
        if (fn)
          fn();
      });
    }
    loadMedia(filename, fn) {
      pool.query('SELECT data FROM media WHERE filename = ($1)', [filename], (err, res) => {
        if (err)
          return console.error('Error running query', err);
        if (fn)
          if (res.rows[0])
            fn(null, res.rows[0].data);
      });
    }
    createart(input) {
      if (input.title && input.desc && input.thumbnail) {
        let func = (err, res) => {
          if(err)
              return console.error('error running query', err);
        }
        if (input.id !== '-1')
          pool.query('UPDATE articles SET (title, description, thumbnail, data, date, author) = ($1, $2, $3, $4, $5, $6) WHERE id = ($7)', [input.title, input.desc, input.thumbnail, input.data, input.date, input.author, input.id], func);
        else
          pool.query('INSERT INTO articles (title, description, thumbnail, data, date) VALUES ($1, $2, $3, $4, $5)', [input.title, input.desc, input.thumbnail, input.data, input.date], func);
      }
    }
    listarticles(fn) {
      let articles = [];
      pool.query('SELECT * FROM articles ORDER BY id DESC', (err, res) => {
          if(err)
              return console.error('error running query', err);
          for (let i=0; i<res.rows.length; i++) {
            articles.push({ title: res.rows[i].title, desc: res.rows[i].description, thumbnail: res.rows[i].thumbnail, id: res.rows[i].id });
          }
          return fn(articles);
      });
    }
    loadArticle(id, fn) {
      pool.query('SELECT * FROM articles WHERE id = ($1)', [id], (err, res) => {
        if(err)
            return console.error('error running query', err);
          if (fn && res.rows[0])
            fn({title: res.rows[0].title, body: res.rows[0].data, description: res.rows[0].description, thumbnail: res.rows[0].thumbnail, id: res.rows[0].id, date: res.rows[0].date, author: res.rows[0].author || '-1'});
          else
            fn();
      })
    }
}

module.exports = new Database;
module.exports.pool = pool
