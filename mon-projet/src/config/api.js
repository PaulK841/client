// Configuration des URLs d'API pour différents environnements
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://votre-backend-render.onrender.com'
  : 'http://localhost:5000';

export default API_BASE_URL;
