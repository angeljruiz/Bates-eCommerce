class Pager {
  constructor() {
    this.loggedIn = false;
    this.cart = [];
  }

  update(req, cart) {
    let f = req.flash('incorrect') + req.flash('thankyou') + req.flash('taken') + req.flash('notLogged') + req.flash('itemRemoved');
    req.res.locals.flash = f;
    if (req.isAuthenticated())
      this.loggedIn = true;
    else
      this.loggedIn = false;
    if (typeof req.user !== 'undefined') {
      this.user = req.user.username;
      if (req.user.id === '113536219076962285527' || req.user.id === '3089221391120478' || req.user.id == '8087529995')
        this.aauth = true;
    } else {
      this.aauth = false;
      this.user = 0;
    }
    this.path = req.path
    if (cart)
      this.cart = cart;
    let keys = Object.keys(this);
    Object.entries(this).forEach( (entries, index) => {
      req.res.locals[entries[0]] = entries[1];
    })
  }
}

module.exports = new Pager;
