var fs = require("fs");
var sharp = require("sharp");

sharp.cache(false);

module.exports = {
  isLoggedOn: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.path === "/user" && req.query.id === req.user.id)
        return res.redirect("/");
      return next();
    }
    req.flash("notLogged", "Please sign in");
    res.redirect("/login");
  },

  resizeImages: async (req, res, next) => {
    if (!req.file) return next();

    req.body.images = [];
    await sharp(req.file.path)
      .resize(300, 300, { fit: "inside" })
      .toFormat("jpeg")
      .jpeg()
      .toFile(`uploads/${req.file.filename + "r"}`);
    fs.unlink(req.file.path, () => {});
    req.file.path += "r";
    req.file.filename += "r";

    next();
  },
};
