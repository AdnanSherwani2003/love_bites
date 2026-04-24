'use client';
import React, { useState, useEffect } from 'react';
import LoveBitesLogo from './LoveBitesLogo';
import './PaymentPage.css';

interface PaymentPageProps {
  amount: 49 | 99 | 149;
  planName: string;
  planEmoji: string;
  recipientName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: () => void;
  onBack: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  amount: initialAmount,
  planName,
  planEmoji,
  recipientName,
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  onSuccess,
  onBack,
}) => {
  const [screen, setScreen] = useState<'form' | 'processing' | 'success' | 'failed'>('form');
  const [selectedPlan, setSelectedPlan] = useState<number>(initialAmount);
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => console.error('Razorpay SDK failed to load');
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (isLoading || !isScriptLoaded) return;
    setIsLoading(true);

    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedPlan }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        console.error("❌ Frontend: Order API failed:", err);
        throw new Error(err.error || 'Order creation failed');
      }
      const orderData = await orderRes.json();
      console.log("✅ Frontend: Order object received from backend:", orderData);

      // 2. Open Razorpay Standard Checkout
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      if (!key) {
        console.error("❌ Frontend: NEXT_PUBLIC_RAZORPAY_KEY_ID is missing!");
        window.alert("Critical Error: Razorpay Key is missing in frontend! Check your .env.local and restart the server.");
        setIsLoading(false);
        return;
      }
      
      const options = {
        key: key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LoveBites",
        description: `Premium Digital Gift for ${recipientName}`,
        image: "https://lovebites.vercel.app/logo.png",
        order_id: orderData.id, // Using orderData.id as the full object is returned
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#9b1a3a",
          backdrop_color: "rgba(0,0,0,0.85)",
        },
        modal: {
          backdropclose: false,
          animation: true,
          ondismiss: function () {
            console.log("ℹ️ Frontend: Payment modal dismissed by user");
            setIsLoading(false);
          },
        },
        handler: function (response: any) {
          console.log("✅ Frontend: Razorpay payment successful!", response);
          setScreen('processing');

          // 3. Verify payment on backend
          fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          }).then(async (verifyRes) => {
            console.log("📡 Frontend: Verification response status:", verifyRes.status);
            if (verifyRes.ok) {
              console.log("🎉 Frontend: Verification SUCCESSFUL");
              setScreen('success');
              try { 
                onSuccess(); 
              } catch(e) { 
                console.error('onSuccess error:', e); 
              }
            } else {
              const err = await verifyRes.json();
              console.error("❌ Frontend: Verification failed:", err.error || err.message);
              setScreen('failed');
            }
          }).catch((err) => {
            console.error("❌ Frontend: Verification fetch error:", err);
            setScreen('failed');
          });
        },
      };

      console.log("🚀 Frontend: Opening Razorpay with options:", options);
      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('❌ Frontend: Payment failed event:', response.error);
        setScreen('failed');
      });

      rzp.open();
    } catch (error: any) {
      console.error('❌ Frontend: Checkout flow error:', error);
      setScreen('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    { amount: 49, name: 'Sweet Start', emoji: '🌸', tag: 'Standard' },
    { amount: 99, name: 'True Love', emoji: '💕', tag: 'Popular' },
    { amount: 149, name: 'Grand Amour', emoji: '👑', tag: 'Premium' },
  ];

  const currentPlan = plans.find((p) => p.amount === selectedPlan) || plans[0];

  if (screen === 'processing') {
    return (
      <div className="full-screen-status">
        <div className="spinning-ring">
          <div className="heart-logo">
            <LoveBitesLogo size={30} />
          </div>
        </div>
        <h2 className="status-title">Verifying Payment</h2>
        <p className="status-sub">PLEASE DO NOT CLOSE THIS WINDOW</p>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    );
  }

  if (screen === 'success') {
    return (
      <div className="full-screen-status">
        {/* Confetti */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              '--tx': `${(Math.random() - 0.5) * 400}px`,
              '--ty': `${(Math.random() - 0.5) * 400}px`,
              '--bg': ['#9b1a3a', '#d4af37', '#22c55e', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'][Math.floor(Math.random() * 7)],
              '--br': Math.random() > 0.5 ? '50%' : '0px',
              animationDelay: `${Math.random() * 0.2}s`,
            } as any}
          />
        ))}
        
        <svg className="success-checkmark" viewBox="0 0 88 88">
          <circle className="success-circle" cx="44" cy="44" r="36" />
          <path className="success-path" d="M28 44 L40 57 L60 30" />
        </svg>

        <h2 className="success-title">Payment Successful 🎉</h2>
        <p className="success-plan-info">₹{selectedPlan} · {currentPlan.name}</p>
        <p className="success-quote">"Your LoveBite for {recipientName} is being crafted with love 💕"</p>
        <button className="pay-button" style={{ width: 'auto', marginTop: '20px' }} onClick={() => setScreen('form')}>
          View Your LoveBite →
        </button>
      </div>
    );
  }

  if (screen === 'failed') {
    return (
      <div className="full-screen-status">
        <svg className="success-checkmark" viewBox="0 0 88 88">
          <circle className="failed-circle" cx="44" cy="44" r="36" />
          <path className="failed-path" d="M30 30 L58 58 M58 30 L30 58" />
        </svg>
        <h2 className="success-title">Payment Failed</h2>
        <p className="success-plan-info">We couldn't process your payment. Please try again.</p>
        <button className="try-again-button" onClick={() => setScreen('form')}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <div className="payment-card">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div style={{ marginBottom: '32px' }}>
            <LoveBitesLogo size={24} />
          </div>

          <div className="section-label">Order Summary</div>

          <div className="selected-plan-card">
            <div className="left-accent-bar"></div>
            <div className="plan-contents">
              <span className="plan-emoji">{currentPlan.emoji}</span>
              <span className="plan-name">{currentPlan.name}</span>
              <span className="plan-tagline">Premium digital gift for {recipientName}</span>
              <div className="plan-badge">{currentPlan.tag} Plan</div>
            </div>
          </div>

          <div className="amount-due-section">
            <div className="amount-label">Amount Due</div>
            <div className="amount-value">
              <span className="currency-symbol">₹</span>
              <span className="amount-number">{selectedPlan}</span>
            </div>
            <div className="amount-sub">One-time payment · No subscription</div>
          </div>

          <div className="recipient-section">
            <div className="recipient-label">Gift for</div>
            <div className="recipient-name">{recipientName}</div>
          </div>

          <div className="switch-plan-list">
            {plans.map((p) => (
              <div
                key={p.amount}
                className={`plan-row ${selectedPlan === p.amount ? 'active' : ''}`}
                onClick={() => setSelectedPlan(p.amount)}
              >
                <div className="plan-row-left">
                  <div className="checkmark-circle">{selectedPlan === p.amount ? '✓' : ''}</div>
                  <span className="plan-emoji" style={{ fontSize: '14px' }}>{p.emoji}</span>
                  <span className="plan-row-name">{p.name}</span>
                </div>
                <div className="plan-row-price">₹{p.amount}</div>
              </div>
            ))}
          </div>

          <div className="back-link" onClick={onBack}>← Back to preview</div>
        </div>

        {/* RIGHT PANEL - SIMPLIFIED FOR STANDARD CHECKOUT */}
        <div className="right-panel">
          <div className="section-label">Complete Payment</div>
          
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#fff8f0' }}>Secure Checkout</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
              We use Razorpay to ensure your payment information is safe and secure. 
              Click the button below to open the payment window.
            </p>
          </div>

          <button 
            className="pay-button" 
            onClick={handlePayment} 
            disabled={isLoading || !isScriptLoaded}
          >
            {isLoading ? 'INITIALIZING...' : `PAY ₹${selectedPlan} NOW`}
          </button>



          <div className="ssl-note">
            🔒 Secured by Razorpay · 256-bit SSL
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
