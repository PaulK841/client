import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('loading');
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState(null);

    const sessionId = searchParams.get('session_id');
    const { refreshUserProfile } = useAuth();

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError('Missing Session ID');
                setPaymentStatus('error');
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/stripe/verify-payment/${sessionId}`);
                
                if (response.data.success) {
                    setPaymentStatus('success');
                    setPaymentDetails(response.data);
                    
                    // Rafraîchir le profil plusieurs fois pour être sûr que les webhooks ont eu le temps
                    console.log('Payment verified, refreshing user profile...');
                    await refreshUserProfile();
                    
                    // Rafraîchir encore une fois après 2 secondes (au cas où les webhooks ont du retard)
                    setTimeout(async () => {
                        console.log('Second profile refresh after webhook delay...');
                        await refreshUserProfile();
                    }, 2000);

                } else {
                    setPaymentStatus('failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setError('An error occurred while verifying your payment.');
                setPaymentStatus('error');
            }
        };

        verifyPayment();
    }, [sessionId, refreshUserProfile]);

    const handleContinue = () => {
        navigate('/dashboard');
    };

    if (paymentStatus === 'loading') {
        return (
            <div className="payment-success-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <h2>Verifying Payment...</h2>
                    <p>Please wait while we confirm your payment.</p>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'error') {
        return (
            <div className="payment-success-page">
                <div className="error-container">
                    <div className="error-icon">❌</div>
                    <h2>Payment Error</h2>
                    <p>{error || 'An error occurred while verifying your payment.'}</p>
                    <button onClick={() => navigate('/pricing')} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="payment-success-page">
                <div className="failed-container">
                    <div className="failed-icon">⚠️</div>
                    <h2>Payment Not Confirmed</h2>
                    <p>We could not confirm your payment. Please try again.</p>
                    <button onClick={() => navigate('/pricing')} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-success-page">
            <div className="success-container">
                <div className="success-icon">✅</div>
                <h1>Payment Successful!</h1>
                <p>Thank you for your purchase. Your account has been updated.</p>
                
                {paymentDetails && (
                    <div className="payment-details">
                        <h3>Payment Details</h3>
                        <div className="detail-item">
                            <span>Email:</span>
                            <span>{paymentDetails.customerEmail}</span>
                        </div>
                        <div className="detail-item">
                            <span>Amount:</span>
                            <span>{(paymentDetails.amount / 100).toFixed(2)}€</span>
                        </div>
                        <div className="detail-item">
                            <span>Currency:</span>
                            <span>{paymentDetails.currency.toUpperCase()}</span>
                        </div>
                    </div>
                )}

                <button onClick={handleContinue} className="continue-button">
                    Continue to Dashboard
                </button>
            </div>

            <style jsx>{`
                .payment-success-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                }

                .success-container,
                .error-container,
                .failed-container,
                .loading-container {
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }

                .success-icon,
                .error-icon,
                .failed-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                h1 {
                    color: #1f2937;
                    margin-bottom: 10px;
                    font-size: 2rem;
                }

                h2 {
                    color: #1f2937;
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                }

                h3 {
                    color: #374151;
                    margin-bottom: 20px;
                    font-size: 1.2rem;
                }

                p {
                    color: #6b7280;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }

                .payment-details {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    text-align: left;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding: 5px 0;
                }

                .detail-item span:first-child {
                    font-weight: 600;
                    color: #374151;
                }

                .detail-item span:last-child {
                    color: #6b7280;
                }

                .continue-button,
                .retry-button {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .continue-button:hover,
                .retry-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }

                .retry-button {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
                }

                .retry-button:hover {
                    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccessPage;