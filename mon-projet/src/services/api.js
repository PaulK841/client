import axios from 'axios';

/**
 * L'URL de base de notre API.
 * Elle utilise la variable d'environnement REACT_APP_API_URL si elle est définie (en production sur Vercel),
 * sinon, elle utilise l'adresse du serveur local pour le développement.
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// On crée une instance d'Axios avec l'URL de base dynamique.
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Un "intercepteur" qui s'exécute avant CHAQUE requête envoyée par Axios.
 * Son rôle est de vérifier si un token d'authentification existe dans le localStorage.
 * Si oui, il l'ajoute à l'en-tête (header) de la requête.
 * C'est ce qui permet de faire fonctionner nos routes protégées.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // On ajoute l'en-tête standard 'Authorization'
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;