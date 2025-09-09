import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(username, email, password)
    } catch (err) {
      // --- LA MODIFICATION EST ICI ---
      // On lit le message d'erreur précis envoyé par le backend.
      // S'il n'y en a pas (ex: erreur réseau), on affiche un message par défaut.
      const message =
        err.response?.data?.message || 'An unexpected error occurred. Please try again.'
      setError(message)
      // ------------------------------------
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Register
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage