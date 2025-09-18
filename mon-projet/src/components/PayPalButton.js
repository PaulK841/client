import React, { useState } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PayPalButton = () => {
    const navigate = useNavigate();
    const { refreshUserProfile } = useAuth();
    const [error, setError] = useState(null);

    const createSubscription = async (data, actions) => {
        try {
            setError(null);
            console.log("Creating PayPal subscription...");
            const response = await api.post('/api/paypal/orders'); // Pointe vers la nouvelle logique createSubscription
            console.log("Subscription created:", response.data.subscriptionId);
            return response.data.subscriptionId;
        } catch (err) {
            console.error("API Error (createSubscription):", err.response?.data?.message || err.message);
            setError("Could not initiate the subscription process. Please try again.");
            return null;
        }
    };

    const onApprove = async (data, actions) => {
        try {
            console.log("Subscription approved by user:", data.subscriptionID);
            // The webhook will handle the database update.
            await refreshUserProfile();
            navigate('/payment-success'); // Rediriger vers une page de succès générique
        } catch (err) {
            console.error("Error (onApprove):", err);
            setError("An error occurred while finalizing your subscription.");
            navigate('/payment-cancel');
        }
    };

    const onError = (err) => {
        console.error("PayPal Button Error:", err);
        setError("An error occurred with PayPal. Payment was not processed.");
    };

    return (
        <div className="paypal-payment">
            <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "subscribe" }}
                createSubscription={createSubscription}
                onApprove={onApprove}
                onError={onError}
            />
            {error && <div className="error-message">{error}</div>}
            <style jsx>{`
              .error-message {
                color: #ef4444;
                margin-top: 10px;
                text-align: center;
              }
            `}</style>
        </div>
    );
};

export default PayPalButton;