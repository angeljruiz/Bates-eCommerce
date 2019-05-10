module.exports = {

  isLoggedOn: (req, res, next) => {
    if(req.isAuthenticated()) {
      if (req.path === '/user' && req.query.id === req.user.localId)
        return res.redirect('/');
      return next();
    }
    res.flash('notLogged', 'Please sign in')
    res.redirect('/login');
  },

  validateInfo: (req, res, next) => {
    console.log(req.body);
    if (req.body.username === '' || req.body.password === '' || req.body.email === '') {
      req.res.flash('incorrect', 'Invalid username, email, or password');
      if (req.originalUrl === '/login')
        return res.redirect('/login');
      else
        return res.redirect('/signup');
    }
    return next();
  },

  async: generator => {
    let iterator = generator();

    function handle(iteratorResult) {
      if (iteratorResult.done) { return; }

      const iteratorValue = iteratorResult.value;

      if (iteratorValue instanceof Promise) {
        iteratorValue.then(res => handle(iterator.next(res))).catch(err => iterator.throw(err));
      }
    }
    try {
      handle(iterator.next());
    } catch(e) {
      iterator.throw(e);
    }
  },

  formatDate: date => {
    let monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let c = hours >= 12 ? 'Pm' : 'Am';
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours % 12;
    hours = hours === 0? 12 : hours;
    let time = hours + ':' + minutes;

    return monthNames[monthIndex] + ' ' + day + ' at ' + time + ' ' + c;
  }
}
