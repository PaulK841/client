// server/routes/downloadRoutes.js
const express = require('express');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/latest', protect, async (req, res, next) => {
  try {
    const user = req.user; // injecté par protect
    const isSubscribed = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();
    if (!isSubscribed) {
      return res.status(403).json({ message: 'Subscription inactive or expired.' });
    }

    // OPTION 1 : servir un fichier local (ex: /releases/AimGuard-Setup.exe)
    const filePath = path.join(__dirname, '..', 'releases', 'AimGuard-Setup.exe'); // adapte !
    // OPTION 2 : rediriger vers une URL signée (S3/GCS)
    // return res.redirect(signedUrl);

    res.download(filePath, 'AimGuard-Setup.exe'); // forcer le nom de fichier côté client
  } catch (err) {
    next(err);
  }
});

module.exports = router;
