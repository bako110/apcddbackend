const News = require('../models/News');
const path = require('path');
const fs = require('fs');

// Fonction utilitaire pour supprimer un fichier de manière sécurisée
const deleteFileSafe = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error(`Erreur suppression fichier : ${err.message}`);
    }
};

// Ajouter une actualité
exports.addNews = async (req, res) => {
    try {
        const { title, date, category, summary, content, featured } = req.body;

        // Validation minimale
        if (!title || !date || !category || !summary || !content) {
            if (req.file) deleteFileSafe(path.join(__dirname, '..', 'uploads', req.file.filename));
            return res.status(400).json({ message: "Champs obligatoires manquants" });
        }

        let imagePath = null;
        if (req.file) {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            if (!allowedExts.includes(ext)) {
                deleteFileSafe(path.join(__dirname, '..', 'uploads', req.file.filename));
                return res.status(400).json({ message: "Format d'image non supporté" });
            }
            imagePath = `/uploads/${req.file.filename}`;
        }

        const news = new News({
            title,
            date,
            category,
            summary,
            content,
            featured: featured === 'true' || featured === true,
            image: imagePath
        });

        await news.save();
        return res.status(201).json(news);

    } catch (err) {
        console.error("Erreur addNews :", err);
        if (req.file) deleteFileSafe(path.join(__dirname, '..', 'uploads', req.file.filename));
        return res.status(500).json({ message: "Erreur serveur lors de l'ajout" });
    }
};

// Récupérer toutes les actualités
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find().sort({ createdAt: -1 });
        return res.status(200).json(newsList);
    } catch (err) {
        console.error("Erreur getAllNews :", err);
        return res.status(500).json({ message: "Erreur serveur lors du chargement" });
    }
};

// Récupérer une actualité par ID
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: "Actualité introuvable" });
        }
        return res.status(200).json(news);
    } catch (err) {
        console.error("Erreur getNewsById :", err);
        return res.status(500).json({ message: "Erreur serveur lors du chargement" });
    }
};

// Mettre à jour une actualité
exports.updateNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            if (req.file) deleteFileSafe(path.join(__dirname, '..', 'uploads', req.file.filename));
            return res.status(404).json({ message: "Actualité introuvable" });
        }

        if (req.file) {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            if (!allowedExts.includes(ext)) {
                deleteFileSafe(path.join(__dirname, '..', 'uploads', req.file.filename));
                return res.status(400).json({ message: "Format d'image non supporté" });
            }
            if (news.image) {
                deleteFileSafe(path.join(__dirname, '..', news.image));
            }
            req.body.image = `/uploads/${req.file.filename}`;
        }

        // Force la conversion explicite de featured en booléen
        if ('featured' in req.body) {
            req.body.featured = req.body.featured === 'true' || req.body.featured === true;
        }

        Object.assign(news, req.body);
        await news.save();
        return res.status(200).json(news);

    } catch (err) {
        console.error("Erreur updateNews :", err);
        return res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
    }
};

// Supprimer une actualité
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: "Actualité introuvable" });
        }

        if (news.image) {
            deleteFileSafe(path.join(__dirname, '..', news.image));
        }

        await news.deleteOne();
        return res.status(200).json({ message: "Actualité supprimée avec succès" });

    } catch (err) {
        console.error("Erreur deleteNews :", err);
        return res.status(500).json({ message: "Erreur serveur lors de la suppression" });
    }
};
