# ✅ Checklist Déploiement Render + Vercel

## 🔧 Configuration Stripe

- [ ] Compte Stripe créé
- [ ] Produit "AimGuard Starter Pack" créé (49.99€)
- [ ] Price ID copié (commence par `price_`)
- [ ] Clés API récupérées :
  - [ ] Publishable key (`pk_test_...`)
  - [ ] Secret key (`sk_test_...`)

## 🖥️ Backend (Render)

- [ ] Repository GitHub connecté à Render
- [ ] Dossier `server/` sélectionné
- [ ] Variables d'environnement configurées :
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `PAYPAL_CLIENT_ID`
  - [ ] `PAYPAL_CLIENT_SECRET`
  - [ ] `PAYPAL_MODE=sandbox`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `CLIENT_URL` (URL Vercel)
  - [ ] `PORT=5000`
- [ ] Déploiement réussi
- [ ] URL backend récupérée

## 🌐 Frontend (Vercel)

- [ ] Repository GitHub connecté à Vercel
- [ ] Dossier `mon-projet/` sélectionné
- [ ] Variables d'environnement configurées :
  - [ ] `REACT_APP_API_URL` (URL Render)
- [ ] Price ID mis à jour dans `PricingPage.js`
- [ ] Déploiement réussi
- [ ] URL frontend récupérée

## 🔄 Configuration finale

- [ ] `CLIENT_URL` dans Render mis à jour avec l'URL Vercel
- [ ] Redéploiement Render effectué

## 🧪 Tests

- [ ] Site accessible via URL Vercel
- [ ] Page `/pricing` fonctionne
- [ ] Bouton Stripe visible
- [ ] Test paiement avec carte `4242 4242 4242 4242`
- [ ] Redirection vers `/payment-success`
- [ ] Vérification paiement réussie

## 📁 Fichiers créés/modifiés

### Backend
- [x] `server/controllers/stripeController.js`
- [x] `server/routes/stripeRoutes.js`
- [x] `server/server.js` (routes ajoutées)
- [x] `server/config/db.js` (compatible Render)
- [x] `server/package.json` (engines ajouté)
- [x] `server/render.yaml`

### Frontend
- [x] `mon-projet/src/components/StripeButton.js`
- [x] `mon-projet/src/pages/PaymentSuccessPage.js`
- [x] `mon-projet/src/pages/PricingPage.js` (Stripe ajouté)
- [x] `mon-projet/src/config/api.js`
- [x] `mon-projet/vercel.json`

### Documentation
- [x] `DEPLOYMENT.md`
- [x] `CHECKLIST.md`

## 🚨 Points d'attention

1. **Ordre de déploiement** : Backend → Frontend → Mise à jour CLIENT_URL
2. **Variables d'environnement** : Vérifier les URLs dans chaque plateforme
3. **Price ID** : Remplacer `price_1234567890` par le vrai ID Stripe
4. **HTTPS** : Les deux plateformes utilisent HTTPS automatiquement
5. **CORS** : Configuré pour accepter les requêtes cross-origin

## 🎯 URLs finales

- **Frontend** : `https://votre-app.vercel.app`
- **Backend** : `https://votre-backend.onrender.com`
- **Pricing** : `https://votre-app.vercel.app/pricing`
- **Success** : `https://votre-app.vercel.app/payment-success`
