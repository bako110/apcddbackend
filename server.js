// ==============================
//      Import des modules
// ==============================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

require('dotenv').config();
const connectDB = require('./config/db');

// ==============================
//      Import des routes
// ==============================
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contentRoutes = require('./routes/contentRoutes');
const partnerRoutes = require('./routes/partnerRoutes');

// ==============================
//      Initialisation Express
// ==============================
const app = express();

// ==============================
//      Connexion à la base de données
// ==============================
connectDB();

// ==============================
//      Middleware de sécurité & CORS
// ==============================
// Autoriser toutes les origines (pour dev)
// Et désactiver Cross-Origin-Resource-Policy dans helmet pour éviter blocage des images
app.use(cors({
  origin: '*',
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// ==============================
//      Limitation de requêtes
// ==============================
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
}));

// ==============================
//      Logs HTTP
// ==============================
app.use(morgan('combined'));

// ==============================
//      Parsing JSON & URL encoded
// ==============================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==============================
//      Création automatique du dossier uploads s'il n'existe pas
// ==============================
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Dossier uploads créé automatiquement.');
}

// ==============================
//      Autoriser CORS sur fichiers statiques (uploads) + CORP header
// ==============================
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// ==============================
//      Servir fichiers statiques (uploads)
// ==============================
app.use('/uploads', express.static(uploadsDir));

// ==============================
//      Routes Events & Gallery
// ==============================
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/partners', partnerRoutes);

// ==============================
//      Health check
// ==============================
app.get('/api/health', (req, res) => {
  res.json({
    message: 'API APCDD fonctionne correctement',
    timestamp: new Date().toISOString(),
    status: 'healthy',
  });
});

// ==============================
//      Gestion des erreurs
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
  });
});

// ==============================
//      Lancer serveur
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
