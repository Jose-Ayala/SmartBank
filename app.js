// Load Environment Variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

// Initialize Stripe
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Domain
const DOMAIN = 'http://localhost:3000';

// Middleware
app.use(cors());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); 
});
app.use(express.json());

// Basic Route for health check
app.get('/', (req, res) => {
    res.json({ status: 'running', message: 'SmartBank API is ready' });
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        // Get the deposit amount from the JSON body
        const userAmount = req.body.amount;

        // Convert Dollars to Cents as requied by Stripe
        const amountInCents = Math.round(Number(userAmount) * 100);

        // Error handling
        if (!userAmount || amountInCents < 10000) {
            return res.status(400).json({
                error: 'Minimum Deposit of at least $100.00'
            });
        }

        // Create the Stripe Session
        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'SmartBank Deposit',
                        description: `Account deposit of $${userAmount}`,
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            }, ],
            mode: 'payment',
            customer_email: 'john.doe@email.com',

            success_url: `http://localhost:5173/payment-success`,
            cancel_url: `http://localhost:5173/payment-cancel`,
        });

        // Return the URL back as JSON
        res.json({
            url: session.url
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = app;