import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({
    ridePrice,
    onSuccess,
    onClose
}) => {
    const [loading, setLoading] = useState(false);

    const handlePay = () => {
        setLoading(true);
        // Simulate a network stripe processing request
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 1500);
    };

    return (
        <div className="modal-overlay">
            <div className="payment-modal">
                <h3>Complete Payment</h3>
                <p>Total amount: <strong>₹{ridePrice}</strong></p>

                <label>Card Number</label>
                <input type="text" className="payment-input" placeholder="0000 0000 0000 0000" />
                
                <div className="payment-row">
                    <div style={{ flex: 1 }}>
                        <label>Expiry</label>
                        <input type="text" className="payment-input" placeholder="MM/YY" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>CVC</label>
                        <input type="password" className="payment-input" placeholder="123" />
                    </div>
                </div>

                <div className="payment-actions">
                    <button className="cancel-btn" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button className="pay-btn" onClick={handlePay} disabled={loading}>
                        {loading ? 'Processing...' : `Pay ₹${ridePrice}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
