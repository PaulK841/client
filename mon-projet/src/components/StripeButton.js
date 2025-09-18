import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const StripeButton = ({ setupFeePriceId, subscriptionPriceId, productName, amount, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to make a payment.');
            }

            const response = await axios.post(`${API_BASE_URL}/api/stripe/create-session`, {
                setupFeePriceId: setupFeePriceId,
                subscriptionPriceId: subscriptionPriceId,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const { url } = response.data;
            window.location.href = url;

        } catch (error) {
            console.error('Payment Error:', error);
            setError(error.response?.data?.error || 'An error occurred during payment.');
            if (onError) onError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stripe-payment">
            <button 
                onClick={handlePayment}
                disabled={loading || !setupFeePriceId.startsWith('price_') || !subscriptionPriceId.startsWith('price_')}
                className={`stripe-button ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <span className="stripe-logo">💳</span>
                        Pay with Stripe ({amount}€)
                    </>
                )}
            </button>
            
            {(!setupFeePriceId.startsWith('price_') || !subscriptionPriceId.startsWith('price_')) && (
                 <div className="error-message">
                    Stripe is not configured. Please replace the placeholder IDs.
                </div>
            )}

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
