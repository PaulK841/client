import React from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const PayPalButton = ({ purchaseType }) => {
  const navigate = useNavigate()
  const { updateUserSubscription } = useAuth()

  const createOrder = async () => {
    try {
      const response = await api.post('/paypal/orders', { purchaseType })
      return response.data.id
    } catch (error) {
      // --- LA MODIFICATION EST ICI ---
      // On lit le message d'erreur précis du backend et on l'affiche dans une alerte.
      const message =
        error.response?.data?.message || 'Could not connect to the server.'
      alert(`Payment Error: ${message}`)
      // ------------------------------------
      return null
    }
  }

  const onApprove = async (data) => {
    try {
      const response = await api.post(
        `/paypal/orders/${data.orderID}/capture`
      )
      if (response.data.subscriptionExpiresAt) {
        updateUserSubscription(response.data.subscriptionExpiresAt)
      }
      navigate('/success')
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to confirm the payment.'
      alert(`Capture Error: ${message}`)
      navigate('/cancel')
    }
  }

  const onCancel = () => {
    console.log('Payment cancelled by user.')
    navigate('/cancel')
  }

  return (
    <div
      style={{
        maxWidth: '750px',
        minHeight: '200px',
        margin: '2rem auto',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
      />
    </div>
  )
}

export default PayPalButton