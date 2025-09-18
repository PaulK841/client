# 🚀 Guide de Déploiement Render + Vercel

## 📋 Prérequis

1. **Compte Stripe** : [stripe.com](https://stripe.com)
2. **Compte Render** : [render.com](https://render.com) (Backend)
3. **Compte Vercel** : [vercel.com](https://vercel.com) (Frontend)
4. **Base de données MongoDB** : [mongodb.com](https://mongodb.com) (Atlas)

## 🔧 Configuration Stripe

### 1. Créer un produit dans Stripe
- Allez dans **Products** > **Add product**
- **Name**: "AimGuard Starter Pack"
- **Description**: "Hardware device + 1 month software access"
- **Price**: 49.99€
- **Currency**: EUR
- Copiez le **Price ID** (commence par `price_`)

### 2. Récupérer les clés API
- **Developers** > **API keys**
- Copiez :
  - **Publishable key** (`pk_test_...`)
  - **Secret key** (`sk_test_...`)

## 🖥️ Déploiement Backend (Render)

### 1. Connecter le repository
- Connectez votre repo GitHub à Render
- Choisissez le dossier `server/`

### 2. Configuration Render
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node`

### 3. Variables d'environnement Render
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aimguard
JWT_SECRET=votre_jwt_secret_super_securise
PAYPAL_CLIENT_ID=votre_paypal_client_id
PAYPAL_CLIENT_SECRET=votre_paypal_client_secret
PAYPAL_MODE=sandbox
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
CLIENT_URL=https://votre-frontend-vercel.vercel.app
PORT=5000
```

## 🌐 Déploiement Frontend (Vercel)

### 1. Connecter le repository
- Connectez votre repo GitHub à Vercel
- Choisissez le dossier `mon-projet/`

### 2. Configuration Vercel
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 3. Variables d'environnement Vercel
```
REACT_APP_API_URL=https://votre-backend-render.onrender.com
```

### 4. Mettre à jour le Price ID
Dans `mon-projet/src/pages/PricingPage.js`, ligne 47 :
```javascript
priceId="price_VOTRE_VRAI_PRICE_ID_ICI"
```

## 🔄 Ordre de déploiement

1. **Backend d'abord** (Render)
2. **Récupérer l'URL** du backend Render
3. **Frontend ensuite** (Vercel) avec l'URL du backend
4. **Mettre à jour** `CLIENT_URL` dans Render avec l'URL Vercel

## 🧪 Test

### Cartes de test Stripe
- **Succès**: `4242 4242 4242 4242`
- **Échec**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### URLs de test
- **Frontend**: `https://votre-app.vercel.app`
- **Backend**: `https://votre-backend.onrender.com`
- **API Health**: `https://votre-backend.onrender.com/`

## 🚨 Dépannage

### Erreur CORS
- Vérifiez que `CLIENT_URL` dans Render correspond à votre domaine Vercel

### Erreur MongoDB
- Vérifiez que `MONGODB_URI` est correct
- Assurez-vous que l'IP est autorisée dans MongoDB Atlas

### Erreur Stripe
- Vérifiez que les clés Stripe sont correctes
- Assurez-vous que le Price ID existe

## 📱 URLs de production

Après déploiement, vous aurez :
- **Frontend**: `https://votre-app.vercel.app`
- **Backend**: `https://votre-backend.onrender.com`
- **Pricing**: `https://votre-app.vercel.app/pricing`
- **Success**: `https://votre-app.vercel.app/payment-success`

## 🔐 Sécurité

- ✅ Variables d'environnement sécurisées
- ✅ HTTPS automatique
- ✅ CORS configuré
- ✅ Authentification JWT
- ✅ Validation Stripe
