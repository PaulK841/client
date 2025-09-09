import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PayPalButton = () => {
    const navigate = useNavigate();
    const { updateUserSubscriptionStatus } = useAuth();

    const createOrder = async () => {
        try {
            const response = await api.post('/paypal/orders');
            return response.data.id;
        } catch (error) {
            console.error("Error creating PayPal order", error);
            alert("Sorry, we couldn't create your order. Please try again.");
            return null;
        }
    };

    const onApprove = async (data) => {
        try {
            await api.post(`/paypal/orders/${data.orderID}/capture`);
            updateUserSubscriptionStatus();
            navigate('/success');
        } catch (error) {
            console.error("Error capturing PayPal order", error);
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