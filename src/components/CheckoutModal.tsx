'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import { SUBSCRIPTION_PLANS } from '../mockData';

interface CheckoutModalProps {
  planId: string;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ planId, onClose }) => {
  const { processPayment } = useAppState();
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAUiyCYciEufnlVI_0IZlV4nJJBZurvQO6qj506_bfzQ2lJ3KPn6qOD_alJ6FJE1oZClOsuVN787gfBGQ';
  
  const [activeClientId, setActiveClientId] = useState(clientId);
  const [sdkReady, setSdkReady] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  const buttonsRenderedRef = useRef(false);

  if (!plan) return null;

  // Dynamically load PayPal SDK script with fallback support
  useEffect(() => {
    const scriptId = 'paypal-sdk-script';
    
    // Remove any failed or existing script from previous render attempts
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      if ((window as any).paypal && !usingFallback) {
        setSdkReady(true);
        return;
      }
      existingScript.remove();
    }

    setSdkReady(false);
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${activeClientId}&currency=USD`;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    script.onerror = () => {
      console.warn(`Failed to load PayPal SDK with client-id: ${activeClientId}`);
      // If loading fails (e.g. because the Live ID is pending account activation), fall back to working Sandbox ID
      const sandboxFallbackId = 'AQikVI5MeFF_4pPELXwOgAhu48ehOlixkeWfjf2sxFSmPsTkG8k6Fo-9Uhnkpvtr0qIr8UPIL2tV6aer';
      if (activeClientId !== sandboxFallbackId) {
        console.info('Switching to working Sandbox client-id fallback for testing...');
        setActiveClientId(sandboxFallbackId);
        setUsingFallback(true);
      }
    };
    document.body.appendChild(script);
  }, [activeClientId]);

  // Render PayPal Smart Buttons
  useEffect(() => {
    if (sdkReady && step === 'details') {
      const container = document.getElementById('paypal-button-container');
      if (container && !buttonsRenderedRef.current) {
        buttonsRenderedRef.current = true;
        container.innerHTML = ''; // Clear previous renderings to avoid duplicates
        
        try {
          (window as any).paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  description: `BookRumors ${plan.name} Author Campaign Subscription`,
                  amount: {
                    currency_code: 'USD',
                    value: plan.price.toString()
                  }
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              setStep('processing');
              try {
                const details = await actions.order.capture();
                const email = details.payer.email_address;
                const success = await processPayment(planId, 'PayPal', { email });
                
                if (success) {
                  setStep('success');
                  setTimeout(() => {
                    onClose();
                  }, 2000);
                } else {
                  alert('Payment approved by PayPal, but subscription update failed. Please contact support.');
                  setStep('details');
                }
              } catch (err: any) {
                console.error('PayPal Capture Error:', err);
                const errMsg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
                alert(`An error occurred while finalizing your PayPal payment: ${errMsg}`);
                setStep('details');
              }
            },
            onError: (err: any) => {
              console.error('PayPal SDK Checkout Error:', err);
              alert('PayPal checkout failed or was cancelled. Please try again.');
            },
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            }
          }).render('#paypal-button-container');
        } catch (e) {
          console.error('Error initializing PayPal Buttons:', e);
          buttonsRenderedRef.current = false;
        }
      }
    }

    return () => {
      // If we are leaving the details step (unmounting the container), reset the ref
      if (step !== 'details') {
        buttonsRenderedRef.current = false;
      }
    };
  }, [sdkReady, step, planId, plan.name, plan.price, onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px', padding: '0', overflow: 'hidden' }}>
        
        {/* PayPal Header */}
        {step !== 'success' && (
          <div style={{ background: '#003087', color: 'white', padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', fontStyle: 'italic', color: '#0079C1' }}>Pay</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', fontStyle: 'italic', color: '#00457C' }}>Pal</span>
              <h3 style={{ fontSize: '20px', color: 'white', margin: '0 0 0 8px' }}>Checkout</h3>
            </div>
            <p style={{ margin: '0', opacity: '0.8', fontSize: '14px' }}>Pay for {plan.name}</p>
            <span style={{ position: 'absolute', right: '24px', top: '24px', fontSize: '24px', fontWeight: 'bold', color: '#FFB81C' }}>
              ${plan.price.toFixed(2)}
            </span>
          </div>
        )}

        {step === 'details' && (
          <div style={{ padding: '24px' }}>
            {usingFallback && (
              <div style={{ 
                background: '#FFF9E6', 
                border: '1px solid #FFE0B2', 
                color: '#B78103', 
                padding: '10px 12px', 
                borderRadius: '8px', 
                fontSize: '12px', 
                marginBottom: '16px',
                textAlign: 'left',
                lineHeight: '1.4'
              }}>
                ⚠️ <strong>Live credentials pending:</strong> Your PayPal Live credentials are currently inactive because your developer account is under review (visible in your PayPal console's orange banner). Checkout loaded in <strong>Sandbox Mode</strong> for testing.
              </div>
            )}

            <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.5' }}>
              Complete your subscription upgrade using PayPal. Click the button below to check out.
            </div>

            {!sdkReady ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div
                  style={{
                    border: '3px solid var(--border-light)',
                    borderTop: '3px solid #0079C1',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    margin: '0 auto 12px auto',
                    animation: 'spin 1s linear infinite'
                  }}
                ></div>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading PayPal payment console...</span>
              </div>
            ) : (
              <div id="paypal-button-container" style={{ marginTop: '16px', minHeight: '150px' }}></div>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', borderRadius: '8px', marginTop: '12px', padding: '10px' }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div
              style={{
                border: '4px solid var(--border-light)',
                borderTop: '4px solid #0079C1',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                margin: '0 auto 20px auto',
                animation: 'spin 1s linear infinite'
              }}
            ></div>
            <h4>Securing PayPal Wallet Connection...</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>Please do not close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ padding: '60px 24px', textAlign: 'center', background: '#e6fffa' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#319795',
                color: 'white',
                fontSize: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontWeight: 'bold'
              }}
            >
              ✓
            </div>
            <h3 style={{ color: '#234e52', marginBottom: '8px' }}>Payment Approved!</h3>
            <p style={{ color: '#2c7a7b', fontSize: '14px' }}>
              Your BookRumors subscription has been successfully updated.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
