import { Router } from 'express';
import { requireAdminAuth } from '../../middlewares/auth.js';
import authRoutes from './auth.routes.js';
import contentRoutes from './content.routes.js';
import eventsRoutes from './events.routes.js';
import galleryRoutes from './gallery.routes.js';
import newsRoutes from './news.routes.js';
import partnersRoutes from './partners.routes.js';
import membersRoutes from './members.routes.js';
import donationsRoutes from './donations.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import uploadRoutes from './upload.routes.js';
import adminsRoutes from './admins.routes.js';

const router = Router();

// L'authentification admin n'est pas protégée (c'est elle qui délivre le token)
router.use('/auth', authRoutes);

// Toutes les autres routes admin nécessitent un JWT valide
router.use('/dashboard', requireAdminAuth, dashboardRoutes);
router.use('/upload', requireAdminAuth, uploadRoutes);
// Gestion des comptes admin/manager : JWT valide + rôle superadmin (vérifié dans admins.routes.js)
router.use('/admins', requireAdminAuth, adminsRoutes);
router.use('/content', requireAdminAuth, contentRoutes);
router.use('/events', requireAdminAuth, eventsRoutes);
router.use('/gallery', requireAdminAuth, galleryRoutes);
router.use('/news', requireAdminAuth, newsRoutes);
router.use('/partners', requireAdminAuth, partnersRoutes);
router.use('/members', requireAdminAuth, membersRoutes);
router.use('/donations', requireAdminAuth, donationsRoutes);

export default router;
