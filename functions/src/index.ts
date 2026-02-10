import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();

// Initialize Stripe with your secret key
// TODO: Replace with your actual Stripe secret key or use environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "YOUR_STRIPE_SECRET_KEY", {
    apiVersion: "2023-10-16",
});

// Cloud Function to create a Stripe Payment Intent
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required");
    }

    const amount = data.amount as number;

    if (!amount || amount <= 0) {
        throw new functions.https.HttpsError("invalid-argument", "Amount must be a positive number");
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
        });
        return { clientSecret: paymentIntent.client_secret };
    } catch (err: any) {
        throw new functions.https.HttpsError("internal", err.message);
    }
});
