class Pager {
  constructor() {
    this.loggedIn = false;
    this.cart = [];
  }

  update(req, cart) {
    let f = req.flash('incorrect') + req.flash('thankyou') + req.flash('taken') + req.flash('notLogged');
    req.res.locals.flash = f;
    if (req.isAuthenticated())
      this.loggedIn = true;
    else
      this.loggedIn = false;
    if (typeof req.user !== 'undefined') {
      if (req.user.username === 'angel')
        this.aauth = true;
    } else {
      this.aauth = false;
      this.user = 0;
    }
    if (cart)
      this.cart = cart;
    let keys = Object.keys(this);
    Object.entries(this).forEach( (entries, index) => {
      req.res.locals[entries[0]] = entries[1];
    })
  }
}

module.exports = new Pager;
