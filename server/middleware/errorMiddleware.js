// middleware/errorMiddleware.js

/**
 * Middleware de gestion d'erreurs centralisé
 * Doit être placé APRÈS toutes les autres routes dans server.js
 */
const errorHandler = (err, req, res, next) => {
  // Si le status code n'est pas défini, utiliser 500 par défaut
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  // Logger l'erreur complète côté serveur
  console.error('\n🚨 ERROR HANDLER TRIGGERED 🚨');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Method:', req.method);
  console.error('URL:', req.originalUrl);
  console.error('Status Code:', statusCode);
  console.error('Error Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('================================\n');
  
  // Définir le status code
  res.status(statusCode);
  
  // Préparer la réponse d'erreur
  const errorResponse = {
    message: err.message || 'Une erreur est survenue',
    status: statusCode
  };
  
  // En développement, inclure la stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  // Cas spéciaux pour certains types d'erreurs
  if (err.name === 'CastError') {
    errorResponse.message = 'Ressource non trouvée';
    res.status(404);
  } else if (err.name === 'ValidationError') {
    errorResponse.message = Object.values(err.errors).map(e => e.message).join(', ');
    res.status(400);
  } else if (err.code === 11000) {
    // Erreur de duplication MongoDB
    const field = Object.keys(err.keyValue)[0];
    errorResponse.message = `Cette valeur de ${field} existe déjà`;
    res.status(400);
  }
  
  // Envoyer la réponse d'erreur
  res.json(errorResponse);
};

/**
 * Middleware pour gérer les routes non trouvées (404)
 * Doit être placé AVANT le errorHandler mais APRÈS toutes les routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};