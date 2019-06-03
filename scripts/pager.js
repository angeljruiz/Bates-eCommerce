class Pager {
  constructor() {
    this.loggedIn = false;
    this.owner = false;
    this.cart = [];
  }

  update(req, cart) {
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
    if (cart)
      this.cart = cart;
    if (req.path === '/')
      this.owner = true;
    let keys = Object.keys(this);
    Object.entries(this).forEach(entries => {
      req.res.locals[entries[0]] = entries[1];
    })
  }
}

module.exports = new Pager;
