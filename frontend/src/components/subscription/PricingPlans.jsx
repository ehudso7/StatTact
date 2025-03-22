// frontend/src/components/subscription/PricingPlans.jsx
import { useState } from 'react';
import { createCheckoutSession } from '@/lib/stripe';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['Basic formation analysis', 'Limited simulations (3/day)', 'Standard formations only'],
    buttonText: 'Current Plan',
    disabled: true,
    priceId: null,
  },
  {
    name: 'Pro',
    price: '$9.99/month',
    features: ['Advanced tactical analysis', 'Unlimited simulations', 'All formations', 'Tournament mode'],
    buttonText: 'Upgrade to Pro',
    disabled: false,
    priceId: 'price_1234567890', // Replace with your Stripe price ID
  },
  {
    name: 'Elite',
    price: '$19.99/month',
    features: ['Everything in Pro', 'Real-time soccer data', 'Professional insights', 'API access'],
    buttonText: 'Upgrade to Elite',
    disabled: false,
    priceId: 'price_0987654321', // Replace with your Stripe price ID
  },
];

export default function PricingPlans() {
  const [loading, setLoading] = useState(false);
  
  const handleSubscribe = async (priceId) => {
    setLoading(true);
    try {
      await createCheckoutSession(priceId);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-2xl font-bold mb-4">{plan.price}</p>
          <ul className="mb-6 space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => !plan.disabled && handleSubscribe(plan.priceId)}
            disabled={plan.disabled || loading}
            className={`w-full py-2 px-4 rounded ${
              plan.disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Processing...' : plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
