import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AdminShippingPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchShippingAddresses();
    }, []);

    const fetchShippingAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to access this page.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/api/users/shipping-addresses`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setAddresses(response.data.addresses);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shipping addresses:', error);
            setError('Failed to load shipping addresses.');
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Address copied to clipboard!');
        });
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container">
                    <h2>Loading shipping addresses...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page">
                <div className="container">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="header">
                    <h1>📦 Shipping Addresses</h1>
                    <p>Total customers requiring shipment: <strong>{addresses.length}</strong></p>
                </div>

                {addresses.length === 0 ? (
                    <div className="no-addresses">
                        <h3>No shipping addresses found</h3>
                        <p>No customers have ordered hardware yet.</p>
                    </div>
                ) : (
                    <div className="addresses-grid">
                        {addresses.map((item, index) => (
                            <div key={item.userId} className="address-card">
                                <div className="customer-info">
                                    <h3>#{index + 1} - {item.username}</h3>
                                    <p className="email">{item.email}</p>
                                    <p className="status">Status: <span className={`status-${item.subscriptionStatus}`}>{item.subscriptionStatus}</span></p>
                                    <p className="order-date">Order: {new Date(item.orderDate).toLocaleDateString()}</p>
                                </div>

                                <div className="shipping-details">
                                    <h4>📍 Shipping Address</h4>
                                    <div className="address-text">
                                        <p><strong>{item.shippingAddress?.name}</strong></p>
                                        <p>{item.shippingAddress?.line1}</p>
                                        {item.shippingAddress?.line2 && <p>{item.shippingAddress.line2}</p>}
                                        <p>{item.shippingAddress?.postal_code} {item.shippingAddress?.city}</p>
                                        <p>{item.shippingAddress?.state && `${item.shippingAddress.state}, `}{item.shippingAddress?.country}</p>
                                        {item.phoneNumber && <p><strong>📞 {item.phoneNumber}</strong></p>}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(item.fullAddress)}
                                        className="copy-btn"
                                    >
                                        📋 Copy Address
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .admin-page {
                    min-height: 100vh;
                    padding: 40px 20px;
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .header h1 {
                    color: #1f2937;
                    margin-bottom: 10px;
                    font-size: 2.5rem;
                }

                .header p {
                    color: #6b7280;
                    font-size: 1.2rem;
                }

                .no-addresses {
                    text-align: center;
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .addresses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                    gap: 30px;
                }

                .address-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .address-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .customer-info {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                }

                .customer-info h3 {
                    margin: 0 0 5px 0;
                    font-size: 1.3rem;
                }

                .email {
                    margin: 5px 0;
                    opacity: 0.9;
                    font-size: 0.95rem;
                }

                .status, .order-date {
                    margin: 5px 0;
                    font-size: 0.9rem;
                }

                .status-active {
                    color: #10b981;
                    font-weight: bold;
                }

                .status-inactive {
                    color: #f59e0b;
                    font-weight: bold;
                }

                .shipping-details {
                    padding: 20px;
                }

                .shipping-details h4 {
                    color: #1f2937;
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                }

                .address-text {
                    background: #f9fafb;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    border-left: 4px solid #667eea;
                }

                .address-text p {
                    margin: 5px 0;
                    color: #374151;
                    font-size: 0.95rem;
                    line-height: 1.4;
                }

                .copy-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                }

                .copy-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }
            `}</style>
        </div>
    );
};

export default AdminShippingPage;
