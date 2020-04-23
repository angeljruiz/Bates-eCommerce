var fs = require('fs');
var sharp = require('sharp');

sharp.cache(false);

module.exports = {

  isLoggedOn: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.path === '/user' && req.query.id === req.user.id)
        return res.redirect('/');
      return next();
    }
    req.flash('notLogged', 'Please sign in')
    res.redirect('/login');
  },

  validateInfo: (req, res, next) => {
    if (req.body.username === '' || req.body.password === '' || req.body.email === '') {
      req.flash('incorrect', 'Invalid username, email, or password');
      if (req.originalUrl === '/login')
        return res.redirect('/login');
      else
        return res.redirect('/signup');
    }
    return next();
  },

  validInfo: (req, res, next) => {
    if (req.body.fn === '' || req.body.ln === '') {
      req.flash('incorrect', 'Please fill out the entire form');
      return res.redirect('/asguest');
    } else {
      return next();
    }
  },

  formatNumber: num => {
    return (num.slice(0,3) + '-' + num.slice(3,6) + '-' + num.slice(6,10));
  },

  formatDate: date => {
    let months = [
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
    let c = hours >= 12 ? 'PM' : 'AM';
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours % 12;
    hours = hours === 0? 12 : hours;
    let time = hours + ':' + minutes;

    return months[monthIndex] + ' ' + day + ' at ' + time + ' ' + c;
  },

  resizeImages: async (req, res, next) => {
    if (!req.file) return next();

    req.body.images = [];
    await sharp(req.file.path)
      .resize(300, 300, {fit: 'inside'})
      .toFormat("jpeg")
      .jpeg()
      .toFile(`uploads/${req.file.filename + 'r'}`);
    fs.unlink(req.file.path, () => {});
    req.file.path += 'r';
    req.file.filename += 'r';

    next();
  }
}
