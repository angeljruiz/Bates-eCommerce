class Pager {
  constructor() {
    this.loggedIn = false;
    this.owner = false;
  }

  update(req) {
    this.path = 'clickwithit.us' + req.path;
    if (req.isAuthenticated())
      this.loggedIn = true;
    else
      this.loggedIn = false;
    if (typeof req.user !== 'undefined') {
      if (req.user.username === 'angel')
        this.aauth = true;
      if (req.query.id === req.user.id)
        this.owner = true;
      else
        this.owner = false;
    } else {
      this.aauth = false;
      this.user = 0;
      this.owner = false;
    }
    if (req.path === '/')
      this.owner = true;
    for (let prop in this)
      req.res.locals[prop] = this[prop];
  }
}

module.exports = new Pager;
