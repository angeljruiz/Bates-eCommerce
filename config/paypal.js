var Order = require("../models/order");
var Cart = require("../models/cart");

var paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PP_ID,
  client_secret: process.env.PP_PW,
});

class Paypal {
  static itemList(cart) {
    let list = {};
    list.items = [];
    cart.items.forEach((item) => {
      let t = {};
      t.name = item.name;
      t.sku = item.sku;
      t.price = String(item.price);
      t.quantity = item.quantity;
      t.currency = "USD";
      t.description = item.description;
      list.items.push(t);
    });
    return list;
  }

  static async saveOrder(payment) {
    let fn, ln, name;
    let shipping = payment.transactions[0].item_list.shipping_address;
    name = shipping.recipient_name.split(" ");
    if (name.length == 2) {
      fn = name[0];
      ln = name[1];
    } else {
      fn = name[0];
      ln = name[2];
    }
    let order = {
      cid: payment.transactions[0].related_resources[0].sale.parent_payment,
      fn: fn,
      ln: ln,
      date: payment.transactions[0].related_resources[0].sale.update_time,
      processing: false,
      finalized: true,
      shipped: false,
      city: shipping.city,
      state: shipping.state,
      line1: shipping.line1,
      postal_code: shipping.postal_code,
    };
    order = new Order(order);
    await order.save();
  }
  createPayment(cart, host) {
    return new Promise((resolve, reject) => {
      let create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `http://${host}/execute_payment`,
          cancel_url: `http://${host}/cancel_payment`,
        },
        transactions: [
          {
            item_list: Paypal.itemList(cart),
            amount: {
              currency: "USD",
              total: cart.total,
              details: {
                subtotal: cart.subtotal,
                shipping: cart.shipping,
              },
            },
            description: "BE store purchase",
          },
        ],
      };
      paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) resolve(false);
        else resolve(payment);
      });
    });
  }
  async executePayment(payerId, paymentId) {
    let cart = await Cart.retrieve(["cid", paymentId]);
    Cart.getTotal(cart);
    return new Promise((resolve, reject) => {
      const payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: cart.total,
            },
          },
        ],
      };
      paypal.payment.execute(paymentId, payment_json, (err, payment) => {
        if (err) resolve(false);
        else {
          let sender_batch_id = Math.random().toString(36).substring(9);

          let create_payout_json = {
            sender_batch_header: {
              sender_batch_id: sender_batch_id,
              email_subject: "You have a payment",
            },
            items: [
              {
                recipient_type: "EMAIL",
                amount: {
                  value: 0.9,
                  currency: "USD",
                },
                receiver: "angelsandbox@paypal.com",
                note: "Thank you.",
                sender_item_id: "item_3",
              },
            ],
          };
          paypal.payout.create(create_payout_json, true, async function (
            error,
            payout
          ) {
            if (error) {
              console.error(error);
              resolve(false);
            } else {
              await Paypal.saveOrder(payment);
              resolve(payment);
            }
          });
        }
      });
    });
  }
}

module.exports = new Paypal();
