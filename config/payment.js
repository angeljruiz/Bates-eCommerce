const express = require("express");

const router = express.Router();

const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

router.post("/", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 199,
    currency: "usd",
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
  });
  res.send(paymentIntent.client_secret);
});

module.exports = router;
