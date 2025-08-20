const News = require('../models/News');
const cloudinary = require('../cloudinaryConfig');

// Ajouter une actualité
exports.addNews = async (req, res) => {
    try {
        const { title, date, category, summary, content, featured } = req.body;

        // Validation minimale
        if (!title || !date || !category || !summary || !content) {
            return res.status(400).json({ message: "Champs obligatoires manquants" });
        }

        const news = new News({
            title,
            date,
            category,
            summary,
            content,
            featured: featured === 'true' || featured === true,
            image: req.body.image || req.body.media, // URL Cloudinary
            public_id: req.body.public_id || null, // stocker public_id si tu veux supprimer plus tard
        });

        await news.save();
        return res.status(201).json(news);

    } catch (err) {
        console.error("Erreur addNews :", err);
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
        if (!news) return res.status(404).json({ message: "Actualité introuvable" });
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
        if (!news) return res.status(404).json({ message: "Actualité introuvable" });

        // Supprimer l'ancien fichier Cloudinary si nouveau upload
        if (req.file && news.public_id) {
            await cloudinary.uploader.destroy(news.public_id);
            news.image = req.body.image || req.body.media;
            news.public_id = req.body.public_id || null;
        }

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
        if (!news) return res.status(404).json({ message: "Actualité introuvable" });

        // Supprimer l'image sur Cloudinary
        if (news.public_id) {
            await cloudinary.uploader.destroy(news.public_id);
        }

        await news.deleteOne();
        return res.status(200).json({ message: "Actualité supprimée avec succès" });

    } catch (err) {
        console.error("Erreur deleteNews :", err);
        return res.status(500).json({ message: "Erreur serveur lors de la suppression" });
    }
};
