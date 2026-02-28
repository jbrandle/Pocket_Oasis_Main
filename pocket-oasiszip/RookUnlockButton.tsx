import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface Props {
  onUnlock: () => void;  // callback to set unlockedRook = true
}

export default function RookUnlockButton({ onUnlock }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // For MVP: direct redirect to Checkout (no backend)
      // In production: fetch('/api/create-checkout-session') → get session.id
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: import.meta.env.VITE_STRIPE_PRICE_ID, quantity: 1 }],
        mode: 'payment',
        successUrl: `${import.meta.env.VITE_APP_URL}/settings?unlock=success`,
        cancelUrl: `${import.meta.env.VITE_APP_URL}/settings?unlock=cancel`,
      });

      if (error) {
        console.error(error);
        alert('Payment error: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to start checkout');
    }
    setLoading(false);
  };

  // Check URL on mount for success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === 'success') {
      onUnlock();  // set unlockedRook = true in parent
      // Optional: clear URL params or show modal
      window.history.replaceState({}, '', '/settings');
    }
  }, [onUnlock]);

  return (
    <button
      onClick={handleUnlock}
      disabled={loading}
      className="bg-oasis-cyan text-black font-black py-3 px-6 rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
    >
      {loading ? 'Processing...' : 'Unlock Rook • $4.99'}
    </button>
  );
}