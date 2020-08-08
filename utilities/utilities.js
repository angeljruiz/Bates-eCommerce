var path = require("path");
var fs = require("fs");
var mw = require("../config/middleware");

var User = require("../models/user");
var Image = require("../models/image");
var Order = require("../models/order");
var Cart = require("../models/cart");
var Product = require("../models/product");
var Session = require("../models/session");
var Locker = require("../scripts/locker");

var Mall = require("../scripts/mall");
let Paypal = require("../config/paypal");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

module.exports = (app, passport) => {
  Locker.removeLocks();
  Mall.loadMall(app);
  app.use((req, res, next) => {
    res.locals.showTests =
      app.get("env") !== "production" && req.query.test === "1";
    if (!req.session.cart) {
      req.session.cart = new Cart();
    }

    next();
  });

  app.get("/order", async (req, res) => {
    res.send(JSON.stringify(await Order.retrieve()));
  });

  app.delete("/order", async (req, res) => {
    if (res.locals.aauth) {
      let order = new Order({ cid: req.query.cid });
      await order.delete();
      res.redirect("/admin");
    }
  });

  app.patch("/order", async (req, res) => {
    if (!res.locals.aauth) return res.redirect("/");
    let order = await Order.retrieve(["cid", req.query.cid]);
    order.shipped = req.query.tracking;
    await order.save(false, order.publicKey());
    res.send("");
  });

  app.get("/isLogged", (req, res) => {
    let u = { auth: res.locals.aauth };
    Object.keys(req.user || {}).forEach((k) => {
      if (!["id", "password"].includes(k)) u[k] = req.user[k];
    });
    res.send(JSON.stringify(u));
  });

  app.get("/uploads/:name", async (req, res) => {
    if (!fs.existsSync(req.path)) {
      let image = await Image.retrieve(
        ["name", req.params.name],
        ["data", "type"]
      );
      fs.writeFile("." + req.path, image.data, (err) => {
        if (err) throw err;
      });
      res.type(image.type);
      res.send(image.data);
    }
  });

  app.get("/main", async (req, res) => {
    if (!req.query.sku) return res.send("");
    let image = await Image.retrieve(
      ["sku", req.query.sku, "ORDER BY num LIMIT 1"],
      ["name"]
    );
    if (!image) return res.send("");
    res.redirect("/uploads/" + image.name);
  });

  app.get("/product", async (req, res) => {
    let products = await Product.customQuery(
      "SELECT * FROM product ORDER BY quantity DESC"
    );
    if (!products) products = [];
    res.json(products);
  });

  app.post("/product", async (req, res) => {
    // if (!res.locals.aauth) return res.send('');
    let c = new Product(req.body);
    await c.save(false, false);
    res.send("");
  });

  app.patch("/product", async (req, res) => {
    // if (!res.locals.aauth) return res.send('');
    let c = new Product(req.body);
    await c.save(false, c.publicKey());
    res.send("");
  });

  app.delete("/product/:id", async (req, res) => {
    // if (!res.locals.aauth) return res.redirect("/");
    let t = new Product({ sku: req.params.id });
    await t.delete();
    res.send("");
  });

  app.get("/product/:id/image", async (req, res) => {
    let images = await Image.retrieve(
      [
        "sku",
        req.params.id,
        "ORDER BY num" + (req.query.limit ? ` LIMIT ${req.query.limit}` : ""),
      ],
      ["name", "data"]
    );
    if (!images) return res.json([]);
    res.json(images);
  });

  app.post(
    "/product/:id/image",
    upload.single("file"),
    mw.resizeImages,
    async (req, res) => {
      if (!res.locals.aauth || !req.query.sku) return res.send("");
      fs.readFile(req.file.path, "hex", async function (err, data) {
        data = "\\x" + data;
        let image = new Image({
          sku: req.query.sku,
          name: req.file.filename,
          data: data,
          type: req.file.originalname.split(".")[1].toLowerCase(),
        });
        await image.save(["sku", "name", "type", "data"]);
        res.send("");
      });
    }
  );

  app.patch("/product/:id/image/:num", async (req, res) => {
    if (!res.locals.aauth) return res.redirect("/");
    let image = new Image({
      name: req.query.name,
      num: req.query.rename,
      edit: true,
    });
    await image.save(["num"], image.publicKey());
    res.send("");
  });

  app.delete("/product/:id/image/:num", async (req, res) => {
    if (!res.locals.aauth || !req.query.name) return res.send("");
    let image = new Image({ name: req.query.name });
    fs.unlink("./uploads/" + req.query.name, () => {});
    await image.delete();
    res.send("");
  });

  app.post("/create_payment", async (req, res) => {
    let cart = JSON.parse(req.body.cart);
    let locked = await Locker.lockResources(cart, req.sessionID);
    let payment = await Paypal.createPayment(cart, req.get("host"));

    if (locked) {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          cart.cid = payment.id;
          cart = new Cart(cart);
          await cart.save();
          return res.redirect(payment.links[i].href);
        }
      }
    } else {
      await Cart.removeItems(cart, locked);
      req.flash(
        "itemRemoved",
        "We had to remove some items from your cart because they were sold out"
      );
      res.redirect("/cart");
    }
  });

  app.get("/execute_payment", async (req, res) => {
    await Paypal.executePayment(req.query.PayerID, req.query.paymentId);
    Locker.removeSessionLocks(req.sessionID);
    req.session.cart = 0;
    req.flash("thankyou", "Thank you! We'll be shipping your order soon");
    res.redirect("/checkout/" + req.query.paymentId.split("-")[1]);
  });

  app.get("/cancel_payment", (req, res) => {
    res.redirect("/cart");
  });

  app.post(
    "/new",
    passport.authenticate("signup", {
      session: true,
      failureRedirect: "/signup",
    }),
    async (req, res) => {
      let user = await User.retrieve(["id", req.user.id], false);
      req.login(user, (err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    }
  );

  app.post(
    "/login",
    passport.authenticate("login", {
      session: true,
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  });

  app.get("/loggedredirect", async (req, res) => {
    res.redirect("/");
  });
};
