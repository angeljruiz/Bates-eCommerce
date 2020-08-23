const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

const Store = require("../models/store.js");
const Order = require("../models/order");
const Section = require("../models/section");
const Product = require("../models/product.js");
const Image = require("../models/image");

const s3 = new AWS.S3({
  accessKeyId: process.env.BUCKET_ID,
  secretAccessKey: process.env.BUCKET_SECRET,
});

class Mall {
  constructor() {
    this.stores = [];
  }
  loadMall(app) {
    return new Promise(async (resolve) => {
      this.stores = await Store.retrieve(false, false);
      if (!this.stores) return;
      if (!Array.isArray(this.stores)) this.stores = [this.stores];
      this.stores.forEach((store) => {
        app.use(`/${store.url}`, this.createStore(store));
      });
      resolve();
    });
  }

  createStore({ id }) {
    let store = express.Router();

    store.get("/", async (req, res) => {
      let products = await Product.retrieve(["store", id], false);
      res.json(products);
    });

    store.get("/order", async (req, res) => {
      res.json(
        await Order.customQuery(
          `SELECT * FROM orders where store = '${id}' order by date desc `
        )
      );
    });

    store.post("/order", async (req, res) => {
      let order = new Order(req.body);
      order.store = id;
      await order.save();
      res.json(order);
    });

    store.delete("/order/:id", async (req, res) => {
      let order = new Order({ id: req.params.id });
      await order.delete();
      res.send("ok");
    });

    store.patch("/order", async (req, res) => {
      let order = await Order.retrieve(["id", req.query.id]);
      order.shipped = req.query.tracking;
      await order.save(false, order.publicKey());
      res.send("");
    });

    store.get("/product", async (req, res) => {
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

    store.post("/product", async (req, res) => {
      let c = new Product(req.body);
      c.store = id;
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

    store.patch("/product", async (req, res) => {
      let c = new Product(req.body);
      c.save(false, c.publicKey())
        .then(() => res.send("ok"))
        .catch((e) => res.status(400).send(e));
    });

    store.delete("/product/:id", async (req, res) => {
      let t = new Product({ id: req.params.id });
      await t.delete();
      res.send("");
    });

    store.get("/product/:id/image", async (req, res) => {
      let images = await Image.retrieve(
        [
          "id",
          req.params.id,
          "ORDER BY num" + (req.query.limit ? ` LIMIT ${req.query.limit}` : ""),
        ],
        ["name", "url"]
      );
      if (!images) return res.json([]);
      res.json(images);
    });

    store.post(
      "/product/:id/image",
      upload.single("file"),
      async (req, res) => {
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
      }
    );

    store.patch("/product/:id/image/:name", async (req, res) => {
      let image = new Image({
        name: req.query.name,
        num: req.query.rename,
        edit: true,
      });
      await image.save(["num"], image.publicKey());
      res.send("");
    });

    store.delete("/product/:id/image/:name", async (req, res) => {
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

    store.get("/section", async (req, res) => {
      let sections = await Section.customQuery(
        `SELECT * FROM public.section where store = '${id}'`
      );
      if (!sections) sections = [];
      if (!Array.isArray(sections)) sections = [sections];
      res.json(sections);
    });

    store.post("/section", (req, res) => {
      if (!req.body.name || !req.body.num) return res.send("error");

      let section = new Section(req.body);
      section.store = id;
      section.save(["name", "num", "store"]);
      res.send("ok");
    });

    store.patch("/section", (req, res) => {
      if (!req.body.name || !req.body.num || !req.body.id)
        return res.send("error");

      let section = new Section(req.body);
      section.store = id;
      section.save(false, section.publicKey());
      res.send("ok");
    });

    store.delete("/section/:id", async (req, res) => {
      if (!req.params.id) return res.send("error");

      let section = await Section.retrieve(["id", req.params.id]);
      section.delete();
      res.send("ok");
    });

    return store;
  }
}

module.exports = new Mall();
