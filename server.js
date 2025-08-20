// ==============================
//      Import des modules
// ==============================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');
const cloudinary = require('./cloudinaryConfig'); // config Cloudinary

// ==============================
//      Import des routes
// ==============================
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contentRoutes = require('./routes/contentRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const memberRoutes = require('./routes/membersRoutes');
const donationRoutes = require('./routes/donationsRoutes');
const dashboardStatsRoute = require('./routes/dashboardStatsRoute');
const activitiesRoutes = require('./routes/activitiesRoutes');

// ==============================
//      Initialisation Express
// ==============================
const app = express();



// ==============================
//      Faire confiance au proxy (Render, Nginx, etc.)
// ==============================
app.set('trust proxy', 1); // 1 = faire confiance au premier proxy



// ==============================
//      Connexion à la base de données
// ==============================
connectDB();

// ==============================
//      Middleware de sécurité & CORS
// ==============================
app.use(cors({ origin: '*' }));
app.use(helmet({ crossOriginResourcePolicy: true }));

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
//      Routes
// ==============================
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/dashboard-stats', dashboardStatsRoute);
app.use('/api/activities', activitiesRoutes);

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
