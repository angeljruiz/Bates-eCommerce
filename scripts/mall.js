const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const passport = require("passport");

const Store = require("../models/store.js");
const Order = require("../models/order");
const Section = require("../models/section");
const Product = require("../models/product.js");
const Image = require("../models/image");
const Stripe = require("./stripe");

const s3 = new AWS.S3({
  accessKeyId: process.env.BUCKET_ID,
  secretAccessKey: process.env.BUCKET_SECRET,
});

class Mall {
  constructor() {
    this.app;
  }
  loadMall(app) {
    if (app) {
      this.app = app;
    }
    return new Promise((resolve) => {
      this.createStore();
      resolve();
    });
  }

  createStore() {
    let store = new express.Router();

    store.all("*", (req, res, next) => {
      Store.retrieve(["url", req.baseUrl.replace("/", "")]).then((store) => {
        if (!store) res.status(400).send("store not found");
        else {
          req.storeID = store.id;
          req.storeOwner = store.owner;
          req.storeUrl = store.url;
          next();
        }
      });
    });

    store.post("/payment", async (req, res) => {
      let amount = req.body.reduce((sum, item) => sum + Number(item.price), 0);
      const paymentIntent = await Stripe.paymentIntents.create({
        payment_method_types: ["card"],
        amount,
        currency: "usd",
        application_fee_amount: amount * 0.1,
        transfer_data: {
          destination: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
        },
      });
      res.send(paymentIntent.client_secret);
    });

    store.get(
      "/onboard",
      passport.authenticate(["jwt", "bearer"], { session: false }),
      async (req, res) => {
        res.json(
          await Stripe.createAccountLinks(req.user.stripe, req.get("host"))
        );
      }
    );

    store
      .route("/order/:id?")
      .get(async (req, res) => {
        let orders = await Order.customQuery(
          `SELECT * FROM orders where store = '${req.storeID}' order by date desc `
        );
        if (!orders) orders = [];
        if (!Array.isArray(orders)) orders = [orders];
        res.json(orders);
      })
      .post(async (req, res) => {
        let order = new Order(req.body);
        order.store = req.storeID;
        await order.save();
        res.json(order);
      })
      .patch(async (req, res) => {
        let order = await Order.retrieve(["id", req.query.id]);
        order.shipped = req.query.tracking;
        await order.save(false, order.publicKey());
        res.send("");
      })
      .delete(async (req, res) => {
        let order = new Order({ id: req.params.id });
        await order.delete();
        res.send("ok");
      });

    store
      .route("/product/:id?")
      .get(async (req, res) => {
        let images = [];
        let products = await Product.customQuery(
          `SELECT * FROM product WHERE store = '${req.storeID}' ORDER BY quantity DESC`
        );
        if (!products) products = [];
        if (!Array.isArray(products)) products = [products];
        products.forEach(async (product) => {
          images.push(Image.retrieve(["product", product.id]));
        });
        Promise.all(images).then((imgs) => {
          products.map((product, i) => product.images = imgs[i]);
          res.json(products);
        });
      })
      .post(async (req, res) => {
        let c = new Product(req.body);
        c.store = req.storeID;
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
      })
      .patch(async (req, res) => {
        let c = new Product(req.body);
        c.save(false, c.publicKey())
          .then(() => res.send("ok"))
          .catch((e) => res.status(400).send(e));
      })
      .delete(async (req, res) => {
        let t = new Product({ id: req.params.id });
        await t.delete();
        res.send("");
      });

    store
      .route("/product/:id/image/:name?")
      .get(async (req, res) => {
        let images = await Image.retrieve(
          [
            "id",
            req.params.id,
            "ORDER BY num" +
              (req.query.limit ? ` LIMIT ${req.query.limit}` : ""),
          ],
          ["name", "url"]
        );
        if (!images) return res.json([]);
        res.json(images);
      })
      .post(upload.single("file"), async (req, res) => {
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
              name: `${req.file.filename}${type ? "." : ""}${type}`,
              url: data.Location,
              product: req.params.id,
              type,
            });
            await image.save(["name", "type", "url", "product"]);
            res.json(image);
          });
        });
      })
      .delete(async (req, res) => {
        let image = new Image({ name: req.params.name });
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: req.params.name,
        };
        s3.deleteObject(params, async function (err, data) {
          if (err) {
            return res.status(400).send(false);
          }
          await image.delete();
          res.send(true);
        });
      });

    store
      .route("/section/:id?")
      .get(async (req, res) => {
        let sections = await Section.customQuery(
          `SELECT * FROM public.section where store = '${req.storeID}'`
        );
        if (!sections) sections = [];
        if (!Array.isArray(sections)) sections = [sections];
        res.json(sections);
      })
      .post((req, res) => {
        if (!req.body.name || !req.body.num) return res.send("error");

        let section = new Section(req.body);
        section.store = req.storeID;
        section.save(["name", "num", "store"]);
        res.send("ok");
      })
      .patch((req, res) => {
        if (!req.body.name || !req.body.num || !req.body.id)
          return res.send("error");

        let section = new Section(req.body);
        section.store = req.storeID;
        section.save(false, section.publicKey());
        res.send("ok");
      })
      .delete(async (req, res) => {
        if (!req.params.id) return res.send("error");

        let section = await Section.retrieve(["id", req.params.id]);
        section.delete();
        res.send("ok");
      });

    this.app.use(`/:storeUrl`, store);
  }
}

module.exports = new Mall();
