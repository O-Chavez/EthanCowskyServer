const router = require("express").Router();

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post ("/test", async (req,res) => {
  if (req.method === "POST") {
    try {
      const { amount, description } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        description: `EthanCowsky.com - ${description}`
      });
      res.status(200).send(paymentIntent.client_secret);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed")
  }
})

module.exports = router;