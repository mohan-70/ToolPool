const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY"); // Replace with your Stripe secret key

admin.initializeApp();

// Cloud Function to create a Stripe Payment Intent
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required');
  }

  const amount = data.amount;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd'
    });
    return { clientSecret: paymentIntent.client_secret };
  } catch (err) {
    throw new functions.https.HttpsError('internal', err.message);
  }
});

