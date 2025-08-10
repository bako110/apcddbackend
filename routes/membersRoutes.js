const express = require('express');
const router = express.Router();
const memberController = require('../controllers/membersController');

// Créer un nouveau membre
router.post('/', memberController.createMember);

// Récupérer tous les membres
router.get('/', memberController.getAllMembers);

// Récupérer un membre par ID
router.get('/:id', memberController.getMemberById);

// Mettre à jour un membre par ID
router.put('/:id', memberController.updateMember);

// Supprimer un membre par ID
router.delete('/:id', memberController.deleteMember);

module.exports = router;
