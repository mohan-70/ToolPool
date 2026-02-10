// Create a payment intent using Firebase Functions
async function createPayment(amount) {
  const createPaymentIntent = functions.httpsCallable('createPaymentIntent');
  try {
    const result = await createPaymentIntent({ amount });
    const clientSecret = result.data.clientSecret;
    console.log("Payment client secret:", clientSecret);
    alert("Payment ready! Integrate Stripe.js to confirm payment.");
  } catch (err) {
    alert("Payment failed: " + err.message);
  }
}
