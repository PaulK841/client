import React from 'react';
import { useAuth } from '../context/AuthContext';
import StripeButton from '../components/StripeButton';

const RenewalPage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="renewal-page">
                <div className="container">
                    <h2>Please log in to renew your subscription</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="renewal-page">
            <div className="container">
                <div className="renewal-header">
                    <div className="icon">⏰</div>
                    <h1>Subscription Expired</h1>
                    <p>Your AimGuard subscription has expired. Renew now to continue accessing the software.</p>
                </div>

                <div className="renewal-details">
                    <div className="user-info">
                        <h3>Account Details</h3>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.subscriptionExpiresAt && (
                            <p><strong>Expired on:</strong> {new Date(user.subscriptionExpiresAt).toLocaleDateString()}</p>
                        )}
                    </div>

                    <div className="renewal-pricing">
                        <div className="price-card">
                            <h3>Monthly Subscription</h3>
                            <div className="price">
                                <span className="amount">€9.99</span>
                                <span className="period">/month</span>
                            </div>
                            <ul className="features">
                                <li>✅ Full access to AimGuard software</li>
                                <li>✅ All premium features</li>
                                <li>✅ Priority support</li>
                                <li>✅ Regular updates</li>
                            </ul>
                            <div className="payment-section">
                                <StripeButton 
                                    subscriptionPriceId="price_1S96Nr7wlAbicqb4WvBQvwGL" // Abonnement logiciel seulement
                                    setupFeePriceId={null} // Pas de frais de matériel pour le renouvellement
                                    productName="AimGuard Monthly Renewal"
                                    amount={9.99}
                                    isRenewal={true}
                                    onSuccess={() => console.log('Renewal successful')}
                                    onError={(error) => console.error('Renewal Error:', error)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="renewal-footer">
                    <p className="note">
                        <strong>Note:</strong> No hardware fees for renewals - you only pay for continued software access.
                    </p>
                </div>
            </div>

            <style jsx>{`
                .renewal-page {
                    min-height: 100vh;
                    padding: 40px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .renewal-header {
                    text-align: center;
                    margin-bottom: 40px;
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }

                .renewal-header h1 {
                    color: #1f2937;
                    margin-bottom: 10px;
                    font-size: 2.5rem;
                }

                .renewal-header p {
                    color: #6b7280;
                    font-size: 1.2rem;
                    line-height: 1.6;
                }

                .renewal-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 30px;
                }

                @media (max-width: 768px) {
                    .renewal-details {
                        grid-template-columns: 1fr;
                    }
                }

                .user-info, .renewal-pricing {
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .user-info h3, .renewal-pricing h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 1.5rem;
                }

                .user-info p {
                    color: #4b5563;
                    margin-bottom: 10px;
                    font-size: 1rem;
                }

                .price-card {
                    text-align: center;
                }

                .price {
                    margin: 20px 0;
                }

                .amount {
                    font-size: 3rem;
                    font-weight: bold;
                    color: #667eea;
                }

                .period {
                    font-size: 1.2rem;
                    color: #6b7280;
                }

                .features {
                    list-style: none;
                    padding: 0;
                    margin: 30px 0;
                    text-align: left;
                }

                .features li {
                    padding: 8px 0;
                    color: #4b5563;
                    font-size: 1rem;
                }

                .payment-section {
                    margin-top: 30px;
                }

                .renewal-footer {
                    background: white;
                    padding: 20px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .note {
                    color: #6b7280;
                    font-style: italic;
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default RenewalPage;
