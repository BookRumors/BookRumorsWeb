'use client';

import React from 'react';
import { Transaction } from '../mockData';

interface InvoiceProps {
  transaction: Transaction;
  onClose: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ transaction, onClose }) => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px', padding: '32px' }}>
        <button className="modal-close no-print" onClick={onClose}>×</button>
        
        <div id="invoice-print-area">
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-light)', paddingBottom: '24px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: 'var(--primary)', fontFamily: 'Outfit', fontWeight: '800' }}>
                BOOK<span>VERSE</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Book Promotion & Author Marketing Hub
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '20px', textTransform: 'uppercase', color: 'var(--text-dark)' }}>Invoice</h3>
              <p style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>{transaction.invoiceNumber}</p>
            </div>
          </div>

          {/* Invoice Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', fontSize: '14px' }}>
            <div>
              <h5 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>Billed To:</h5>
              <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{transaction.authorName}</p>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Registered BookRumors Creator</p>
              <p style={{ color: 'var(--text-muted)' }}>ID: {transaction.authorId}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h5 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>Payment Info:</h5>
              <p><strong>Date:</strong> {transaction.date}</p>
              <p><strong>Payment Method:</strong> {transaction.paymentMethod}</p>
              <p style={{ wordBreak: 'break-all' }}><strong>Transaction ID:</strong> <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>{transaction.transactionId}</code></p>
            </div>
          </div>

          {/* Invoice Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold', color: 'var(--primary)' }}>Description</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold', color: 'var(--primary)' }}>Billing Period</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 'bold', color: 'var(--primary)' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '15px' }}>{transaction.planName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Access to BookRumors premium author promotion channels.
                  </p>
                </td>
                <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  1 Month (Recurring)
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>
                  ${transaction.amount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <div style={{ width: '250px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${transaction.amount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)' }}>VAT/Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--primary)' }}>${transaction.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <p>Thank you for choosing BookRumors to promote your books!</p>
            <p style={{ marginTop: '4px' }}>If you have any questions regarding this invoice, please contact support@bookrumors.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
