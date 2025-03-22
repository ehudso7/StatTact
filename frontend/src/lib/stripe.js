// frontend/src/lib/stripe.js
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function createCheckoutSession(priceId) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
    }),
  });

  const { sessionId } = await response.json();
  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    console.error(error);
  }
}
