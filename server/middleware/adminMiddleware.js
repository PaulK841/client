const User = require('../models/User');

/**
 * Middleware pour vérifier que l'utilisateur est un administrateur
 * À utiliser APRÈS le middleware 'protect' pour s'assurer que l'utilisateur est connecté
 */
const adminOnly = async (req, res, next) => {
    try {
        // L'utilisateur doit déjà être authentifié par le middleware 'protect'
        if (!req.user || !req.user._id) {
            return res.status(401).json({ 
                error: 'Not authenticated. Please log in first.' 
            });
        }

        // Récupérer l'utilisateur complet depuis la base de données
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found.' 
            });
        }

        // Vérifier si l'utilisateur a le rôle admin
        if (user.role !== 'admin') {
            console.log(`⚠️  Tentative d'accès admin refusée pour: ${user.email} (rôle: ${user.role})`);
            return res.status(403).json({ 
                error: 'Access denied. Administrator privileges required.' 
            });
        }

        console.log(`✅ Accès admin autorisé pour: ${user.email}`);
        // Ajouter les informations complètes de l'utilisateur à req pour les prochains middlewares
        req.adminUser = user;
        next();
    } catch (error) {
        console.error('Erreur middleware admin:', error);
        return res.status(500).json({ 
            error: 'Server error during admin verification.' 
        });
    }
};

module.exports = adminOnly;
