'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { SUBSCRIPTION_PLANS } from '../mockData';

interface CheckoutModalProps {
  planId: string;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ planId, onClose }) => {
  const { processPayment } = useAppState();
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);

  const [method, setMethod] = useState<'Stripe' | 'Razorpay'>('Stripe');
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'details' | 'processing' | 'otp' | 'success'>('details');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('123456');

  if (!plan) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    // Format expiry
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
    }
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name) errs.name = 'Cardholder name is required';
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) errs.cardNumber = 'Card number must be 16 digits';
    if (!formData.expiry || !formData.expiry.includes('/')) errs.expiry = 'Expiry date must be MM/YY';
    if (formData.cvv.length !== 3) errs.cvv = 'CVV must be 3 digits';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStep('processing');
    setTimeout(() => {
      // Generate OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(code);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== sentOtp) {
      alert('Incorrect OTP! Please use the code displayed on screen.');
      return;
    }

    setStep('processing');
    const success = await processPayment(planId, method, formData);
    if (success) {
      setStep('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      alert('Payment failed. Please try again.');
      setStep('details');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px', padding: '0', overflow: 'hidden' }}>
        
        {/* Stripe Header Theme */}
        {method === 'Stripe' && step !== 'success' && (
          <div style={{ background: '#635BFF', color: 'white', padding: '24px', position: 'relative' }}>
            <h3 style={{ fontSize: '20px', color: 'white', margin: '0 0 4px 0' }}>Stripe Checkout</h3>
            <p style={{ margin: '0', opacity: '0.8', fontSize: '14px' }}>Pay for {plan.name}</p>
            <span style={{ position: 'absolute', right: '24px', top: '24px', fontSize: '24px', fontWeight: 'bold' }}>
              ${plan.price.toFixed(2)}
            </span>
          </div>
        )}

        {/* Razorpay Header Theme */}
        {method === 'Razorpay' && step !== 'success' && (
          <div style={{ background: '#0F1D36', color: 'white', padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ background: '#3399FF', width: '24px', height: '24px', borderRadius: '4px' }}></div>
              <h3 style={{ fontSize: '20px', color: 'white', margin: '0' }}>Razorpay Secure</h3>
            </div>
            <p style={{ margin: '0', opacity: '0.8', fontSize: '14px' }}>Paying: {plan.name}</p>
            <span style={{ position: 'absolute', right: '24px', top: '24px', fontSize: '24px', fontWeight: 'bold', color: '#3399FF' }}>
              ${plan.price.toFixed(2)}
            </span>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmitDetails} style={{ padding: '24px' }}>
            {/* Method Chooser */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                className={`btn ${method === 'Stripe' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '6px' }}
                onClick={() => setMethod('Stripe')}
              >
                Stripe Gateway
              </button>
              <button
                type="button"
                className={`btn ${method === 'Razorpay' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '6px', background: method === 'Razorpay' ? '#0F1D36' : '', color: method === 'Razorpay' ? 'white' : '' }}
                onClick={() => setMethod('Razorpay')}
              >
                Razorpay Checkout
              </button>
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Jane Doe"
              />
              {errors.name && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="4111 2222 3333 4444"
              />
              {errors.cardNumber && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{errors.cardNumber}</span>}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="MM/YY"
                />
                {errors.expiry && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{errors.expiry}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="123"
                />
                {errors.cvv && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{errors.cvv}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, borderRadius: '8px' }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, borderRadius: '8px', background: method === 'Stripe' ? '#635BFF' : '#3399FF' }}
              >
                Pay ${plan.price.toFixed(2)}
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div
              style={{
                border: '4px solid var(--border-light)',
                borderTop: `4px solid ${method === 'Stripe' ? '#635BFF' : '#3399FF'}`,
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                margin: '0 auto 20px auto',
                animation: 'spin 1s linear infinite'
              }}
            ></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h4>Securing Payment Gateway Connection...</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>Please do not close this window</p>
          </div>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={{ padding: '32px 24px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '8px' }}>Simulated Bank OTP Verification</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enter the verification code to authorize transaction.
            </p>
            
            <div style={{ background: '#FFF0F2', border: '1px dashed var(--primary)', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', color: 'var(--primary)', display: 'block', fontWeight: 'bold' }}>MOCK SMS NOTIFICATION:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{sentOtp}</span>
            </div>

            <div className="form-group" style={{ maxWidth: '200px', margin: '0 auto 20px auto' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                className="form-input"
                style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px', padding: '8px' }}
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', borderRadius: '8px', background: method === 'Stripe' ? '#635BFF' : '#3399FF' }}
            >
              Verify & Complete Payment
            </button>
          </form>
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
