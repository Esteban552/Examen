const express = require('express');

const router = express.Router();
const precios = { 1: 29900, 2: 249900, 3: 450000 };

router.post('/crear-intento-pago', async (req, res) => {
  const amount = precios[Number(req.body.id_plan)];
  if (!amount) return res.status(400).json({ mensaje: 'Plan no válido.' });
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ mensaje: 'El servicio de pagos no está configurado.' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'mxn',
    automatic_payment_methods: { enabled: true },
  });

  return res.json({ clientSecret: paymentIntent.client_secret });
});

module.exports = router;
