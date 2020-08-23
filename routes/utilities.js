const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Section = require("../models/section");
const Image = require("../models/image");
const Order = require("../models/order");
const Product = require("../models/product");
const Locker = require("../scripts/locker");

const Mall = require("../scripts/mall");

const s3 = new AWS.S3({
  accessKeyId: process.env.BUCKET_ID,
  secretAccessKey: process.env.BUCKET_SECRET,
});

module.exports = (app, passport) => {
  Locker.removeLocks();
  Mall.loadMall(app);

  app.get("/order", async (req, res) => {
    res.json(
      await Order.customQuery("SELECT * FROM orders order by date desc")
    );
  });

  app.post("/order", async (req, res) => {
    let order = new Order(req.body);
    await order.save([
      "fn",
      "ln",
      "date",
      "postal_code",
      "line1",
      "line2",
      "city",
      "state",
      "cart",
      "id",
    ]);
    res.json(order);
  });

  app.delete("/order", async (req, res) => {
    let order = new Order({ id: req.query.id });
    await order.delete();
    res.send("ok");
  });

  app.patch("/order", async (req, res) => {
    let order = await Order.retrieve(["id", req.query.id]);
    order.shipped = req.query.tracking;
    await order.save(false, order.publicKey());
    res.send("");
  });

  app.get("/product", async (req, res) => {
    let images = [];
    let products = await Product.customQuery(
      "SELECT * FROM product ORDER BY quantity DESC"
    );
    products.forEach(async (product) => {
      images.push(Image.retrieve(["id", product.id]));
    });
    Promise.all(images).then((imgs) => {
      products.map((product, i) => (product.images = imgs[i]));
      if (!products) products = [];
      res.json(products);
    });
  });

  app.post("/product", async (req, res) => {
    let c = new Product(req.body);
    c.store = 1;
    await c.save([
      "name",
      "sku",
      "price",
      "quantity",
      "description",
      "section",
      "store",
    ]);
    res.send("");
  });

  app.patch("/product", async (req, res) => {
    let c = new Product(req.body);
    c.save(false, c.publicKey())
      .then(() => res.send("ok"))
      .catch((e) => res.status(400).send(e));
  });

  app.delete("/product/:id", async (req, res) => {
    let t = new Product({ id: req.params.id });
    await t.delete();
    res.send("");
  });

  app.get("/product/:id/image", async (req, res) => {
    let images = await Image.retrieve(
      [
        "id",
        req.params.id,
        "ORDER BY num" + (req.query.limit ? ` LIMIT ${req.query.limit}` : ""),
      ],
      ["name", "data"]
    );
    if (!images) return res.json([]);
    res.json(images);
  });

  app.post("/product/:id/image", upload.single("file"), async (req, res) => {
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
          id: req.params.id,
          name: `${req.file.filename}${type ? "." : ""}${type}`,
          url: data.Location,
          type,
        });
        await image.save(["id", "name", "type", "url"]);
        res.json(image);
      });
    });
  });

  app.patch("/product/:id/image/:name", async (req, res) => {
    let image = new Image({
      name: req.query.name,
      num: req.query.rename,
      edit: true,
    });
    await image.save(["num"], image.publicKey());
    res.send("");
  });

  app.delete("/product/:id/image/:name", async (req, res) => {
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

    if (locked) {
      cart.id = payment.id;
      await cart.save();
    } else {
      res.json(cart);
    }
  });

  app.get("/sections", async (req, res) => {
    let sections = await Section.customQuery(
      "SELECT * FROM public.section where store = '1'"
    );
    if (!sections) sections = [];
    if (!Array.isArray(sections)) sections = [sections];
    res.json(sections);
  });

  app.post("/sections", (req, res) => {
    if (!req.body.name || !req.body.num) return res.send("error");

    let section = new Section(req.body);
    section.store = 1;
    section.save(["name", "num", "store"]);
    res.send("ok");
  });

  app.patch("/sections", (req, res) => {
    if (!req.body.name || !req.body.num || !req.body.id)
      return res.send("error");

    let section = new Section(req.body);
    section.store = 1;
    section.save(false, section.publicKey());
    res.send("ok");
  });

  app.delete("/sections/:id", async (req, res) => {
    if (!req.params.id) return res.send("error");

    let section = await Section.retrieve(["id", req.params.id]);
    section.delete();
    res.send("ok");
  });

  app.get(
    "/account",
    passport.authenticate(["jwt", "bearer"], { session: false }),
    (req, res) => {
      let u = {};
      Object.keys(req.user || {}).forEach((k) => {
        if (!["id", "password"].includes(k)) u[k] = req.user[k];
      });
      res.json(u);
    }
  );

  app.post("/oauth", async (req, res) => {
    let user = await User.retrieve(["id", req.body.id], false);
    if (user || !req.body.username || !req.body.id || !req.body.email)
      return res.send("not saved");
    let newUser = new User(req.body);
    newUser.save();
    res.send("saved");
  });

  app.post(
    "/login",
    passport.authenticate("login", {
      session: false,
    }),
    async (req, res) => {
      let user = await User.retrieve(["id", req.user.id], false);
      const body = { email: user.email };
      const token = jwt.sign({ user: body }, "justatemp");
      res.json({ token });
    }
  );

  app.post(
    "/signup",
    passport.authenticate("signup", {
      session: false,
      failureRedirect: "/signup",
    }),
    async (req, res) => {
      let user = await User.retrieve(["id", req.user.id], false);
      const body = { email: user.email };
      const token = jwt.sign({ user: body }, "justatemp");
      res.json({ token });
    }
  );
};
