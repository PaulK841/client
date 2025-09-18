import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const StripeButton = ({ priceId, productName, amount, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Récupérer le token d'authentification
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vous devez être connecté pour effectuer un paiement');
            }

            // Créer la session de paiement
            const response = await axios.post(`${API_BASE_URL}/api/stripe/create-session`, {
                priceId: priceId,
                productName: productName,
                userId: JSON.parse(localStorage.getItem('user'))?.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const { url } = response.data;

            // Rediriger vers Stripe Checkout
            window.location.href = url;

        } catch (error) {
            console.error('Erreur paiement:', error);
            setError(error.response?.data?.error || 'Erreur lors du paiement');
            if (onError) onError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stripe-payment">
            <button 
                onClick={handlePayment}
                disabled={loading}
                className={`stripe-button ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Traitement...
                    </>
                ) : (
                    <>
                        <span className="stripe-logo">💳</span>
                        Payer avec Stripe ({amount}€)
                    </>
                )}
            </button>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <style jsx>{`
                .stripe-payment {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .stripe-button {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    min-width: 200px;
                    justify-content: center;
                }

                .stripe-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }

                .stripe-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .stripe-button.loading {
                    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .stripe-logo {
                    font-size: 18px;
                }

                .error-message {
                    color: #ef4444;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    padding: 10px 15px;
                    border-radius: 6px;
                    font-size: 14px;
                    text-align: center;
                    max-width: 300px;
                }
            `}</style>
        </div>
    );
};

export default StripeButton;
