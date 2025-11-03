const express = require("express")
const router = express.Router();
const questions = require('../data/questions');

// Retourne l'exo par son ID
router.get('/:id', (req, res) => {
  // Récupère l'ID
  const question = questions[req.params.id];
  // Vérifie si la question existe 
  if (question) {
    res.json(question);
  } else {
    
    res.status(404).json({ error: 'Question non trouvée' });
  }
});

module.exports = router;