import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PayPalButton = ({ purchaseType }) => {
    const navigate = useNavigate();
    const { refreshUserProfile } = useAuth(); // <-- Get the new function

    const createOrder = async () => {
        try {
            const response = await api.post('/paypal/orders', { purchaseType });
            return response.data.id;
        } catch (error) {
            const message = error.response?.data?.message || 'Could not connect to the server.';
            alert(`Payment Error: ${message}`);
            return null;
        }
    };

    const onApprove = async (data) => {
        try {
            await api.post(`/paypal/orders/${data.orderID}/capture`);
            await refreshUserProfile(); // <-- REFRESH THE FULL PROFILE
            navigate('/success');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to confirm the payment.';
            alert(`Capture Error: ${message}`);
            navigate('/cancel');
        }
    };
    
    const onCancel = () => {
        console.log("Payment cancelled by user.");
        navigate('/cancel');
    };

    return (
        <div style={{ maxWidth: '750px', minHeight: '200px', margin: '2rem auto' }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onCancel={onCancel}
            />
        </div>
    );
};

export default PayPalButton;