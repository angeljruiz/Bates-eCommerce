const stripe = require("stripe")(process.env.STRIPE_SECRET);

class Stripe {
  static async retrieve(id) {
    return await stripe.accounts.retrieve(id);
  }
  static async createExpressAccount() {
    return await stripe.accounts.create({
      type: "express",
    });
  }
  static async createAccountLinks(id, host) {
    const accountLinks = await stripe.accountLinks.create({
      account: id,
      refresh_url: `http://${host}`,
      return_url: `http://${host}`,
      type: "account_onboarding",
    });
    return accountLinks;
  }
}

module.exports = Stripe;
