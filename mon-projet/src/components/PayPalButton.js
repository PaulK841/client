import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Le composant accepte maintenant une prop 'purchaseType'
const PayPalButton = ({ purchaseType }) => {
    const navigate = useNavigate();
    const { updateUserSubscription } = useAuth();

    const createOrder = async () => {
        try {
            // On envoie le type d'achat au backend
            const response = await api.post('/paypal/orders', { purchaseType });
            return response.data.id;
        } catch (error) {
            console.error("Error creating PayPal order", error);
            alert("Sorry, we couldn't create your order. Please try again.");
            return null;
        }
    };

    const onApprove = async (data) => {
        try {
            const response = await api.post(`/paypal/orders/${data.orderID}/capture`);
            if (response.data.subscriptionExpiresAt) {
              updateUserSubscription(response.data.subscriptionExpiresAt);
            }
            navigate('/success');
        } catch (error) {
             navigate('/cancel');
        }
    };
    
    const onCancel = () => { /* ... inchangé ... */ };

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