// Ce middleware est appelé quand une erreur est passée avec next(error)
const errorHandler = (err, req, res, next) => {
  // Parfois, une erreur arrive avec un statut 200, ce qui n'a pas de sens.
  // Si c'est le cas, on le change en 500 (Erreur Interne du Serveur).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // On renvoie une réponse JSON claire au frontend
  res.json({
    message: err.message,
    // On n'envoie la "stack trace" (le détail technique de l'erreur)
    // que si on n'est pas en production, pour des raisons de sécurité.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };