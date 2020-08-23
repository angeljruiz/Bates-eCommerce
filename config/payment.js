const express = require("express");

const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/", async (req, res) => {
  let amount = req.body.reduce((sum, item) => sum + Number(item.price), 0);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { integration_check: "accept_a_payment" },
  });
  res.send(paymentIntent.client_secret);
});

// router.post("/payment", async (req, res) => {
//   let cart = JSON.parse(req.body.cart);
//   let locked = await Locker.lockResources(cart, req.sessionID);

//   if (locked) {
//     cart.id = payment.id;
//     await cart.save();
//   } else {
//     res.json(cart);
//   }
// });

module.exports = router;
