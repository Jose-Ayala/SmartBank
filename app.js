// Load Environment Variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();

// Initialize Stripe
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Domain
const DOMAIN = 'http://localhost:3000';

// Simple Middleware for Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); 
});

// Read HTML data
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.json());

// HTML files
app.use(express.static(path.join(__dirname, 'public')));

// Basic Route
app.get('/', (req, res) => {
    res.send('SmartBank API is running...');
});

// Stripe Checkout Route
app.post('/create-checkout-session', async (req, res) => {
  try {
    // Get the amount from the form input
    const userAmount = req.body.amount;

    // Convert Dollars to Cents, Stripe requires an integer (e.g., $10.00 -> 1000 cents)
    const amountInCents = Math.round(Number(userAmount) * 100);

    // Stripe generally requires at least 50 cents
    if (!userAmount || amountInCents < 10000) {
        return res.status(400).send('Error: Minimum Deposit of  at least $100.00');
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SmartBank Deposit',
              description: `Account deposit of $${userAmount}`,
            },
            unit_amount: amountInCents, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/success.html`,
      cancel_url: `${DOMAIN}/cancel.html`,
    });

    // Redirect the user's browser to the Stripe Checkout page
    res.redirect(303, session.url);
  } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send("Internal Server Error");
  }
});

module.exports = app;