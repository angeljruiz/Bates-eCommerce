const AWS = require("aws-sdk");
const fs = require("fs");
const mw = require("../config/middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const User = require("../models/user");
const Image = require("../models/image");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Locker = require("../scripts/locker");

const Mall = require("../scripts/mall");
const Paypal = require("../config/paypal");

const s3 = new AWS.S3({
  accessKeyId: process.env.BUCKET_ID,
  secretAccessKey: process.env.BUCKET_SECRET,
});

module.exports = (app, passport) => {
  Locker.removeLocks();
  Mall.loadMall(app);

  app.get("/order", async (req, res) => {
    res.json(
      await Order.customQuery("SELECT * FROM public.orders order by date desc")
    );
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

  app.get("/product", async (req, res) => {
    let images = [];
    let products = await Product.customQuery(
      "SELECT * FROM product ORDER BY quantity DESC"
    );
    products.forEach(async (product) => {
      images.push(Image.retrieve(["sku", product.sku]));
    });
    Promise.all(images).then((imgs) => {
      products.map((product, i) => (product.images = imgs[i]));
      if (!products) products = [];
      res.json(products);
    });
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
      // if (!res.locals.aauth) return res.send("");
      const type = (req.file.originalname.split(".")[1] || "").toLowerCase();
      fs.readFile(req.file.path, async function (err, data) {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `${req.file.filename}${type ? "." : ""}${type}`,
          Body: data,
          ACL: "public-read",
        };

        s3.upload(params, async function (err, data) {
          if (err) {
            throw err;
          }
          let image = new Image({
            sku: req.params.id,
            name: `${req.file.filename}${type ? "." : ""}${type}`,
            url: data.Location,
            type,
          });
          await image.save(["sku", "name", "type", "url"]);
          res.json(image);
        });
      });
    }
  );

  app.patch("/product/:id/image/:name", async (req, res) => {
    if (!res.locals.aauth) return res.redirect("/");
    let image = new Image({
      name: req.query.name,
      num: req.query.rename,
      edit: true,
    });
    await image.save(["num"], image.publicKey());
    res.send("");
  });

  app.delete("/product/:id/image/:name", async (req, res) => {
    // if (!res.locals.aauth || !req.params.name) return res.send("");
    let image = new Image({ name: req.params.name });
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.params.name,
    };
    s3.deleteObject(params, async function (err, data) {
      if (err) {
        console.log(err);
        return res.send(false);
      }
      await image.delete();
      res.send(true);
    });
  });

  app.post("/payment", async (req, res) => {
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
      res.json(cart);
    }
  });

  app.get("/payment", async (req, res) => {
    await Paypal.executePayment(req.query.PayerID, req.query.paymentId);
    Locker.removeSessionLocks(req.sessionID);
    res.redirect("/checkout/" + req.query.paymentId.split("-")[1]);
  });

  app.post(
    "/user",
    passport.authenticate("signup", {
      session: false,
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
      session: false,
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.post("/logout", (req, res) => {
    res.redirect("/");
  });

  app.post("/loggedredirect", async (req, res) => {
    res.redirect("/");
  });
};
