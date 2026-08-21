import { Router } from 'express';
import contentRoutes from './content.routes.js';
import membersRoutes from './members.routes.js';
import donationsRoutes from './donations.routes.js';
import eventsRoutes from './events.routes.js';
import galleryRoutes from './gallery.routes.js';
import newsRoutes from './news.routes.js';
import partnersRoutes from './partners.routes.js';
import adminRoutes from './admin/index.js';

const router = Router();

router.use('/content', contentRoutes);
router.use('/members', membersRoutes);
router.use('/donations', donationsRoutes);
router.use('/events', eventsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/news', newsRoutes);
router.use('/partners', partnersRoutes);
router.use('/admin', adminRoutes);

export default router;
