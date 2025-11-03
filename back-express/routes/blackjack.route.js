// Import de la bibliothèque express
const express = require("express")
// Création d'un router pour gérer les routes
const router = express.Router();

// Fonction qui tire une carte aléatoire (valeur entre 1 et 11)
const tirerCarte = () => {
  return Math.floor(Math.random() * 11) + 1;
}

// Route POST : reçoit les actions du client
router.post('/', (req, res) => {
  // On récupère l'action et les scores actuels
  const { action, userTotal = 0, cpuTotal = 0 } = req.body;

  // === ACTION "JOUER" : Piocher des cartes ===
  if (action === 'play') {
    // On tire une carte pour le joueur et pour l'ordi
    const carteJoueur = tirerCarte();
    const carteOrdi = tirerCarte();
    
    // On calcule les nouveaux scores
    const nouveauScoreJoueur = userTotal + carteJoueur;
    const nouveauScoreOrdi = cpuTotal + carteOrdi;

    // On détermine le statut de la partie
    let statut = 'En cours';
    if (nouveauScoreJoueur > 21 && nouveauScoreOrdi > 21) {
      statut = 'Égalité (les deux dépassent 21)';
    } else if (nouveauScoreJoueur > 21) {
      statut = 'Perdu (tu dépasses 21)';
    } else if (nouveauScoreOrdi > 21) {
      statut = 'Gagné (l\'ordi dépasse 21)';
    }

    // On renvoie les résultats au client
    return res.json({ 
      userCard: carteJoueur, 
      cpuCard: carteOrdi, 
      userTotal: nouveauScoreJoueur, 
      cpuTotal: nouveauScoreOrdi, 
      status: statut 
    });
  }

  // === ACTION "STOP" : Terminer la partie ===
  if (action === 'stop') {
    // L'ordi doit piocher jusqu'à atteindre au moins 17
    let scoreOrdi = cpuTotal;
    const cartesPiochees = [];
    
    while (scoreOrdi < 17) { 
      const carte = tirerCarte(); 
      scoreOrdi = scoreOrdi + carte; 
      cartesPiochees.push(carte); 
    }

    // On détermine le gagnant final
    let resultat;
    if (scoreOrdi > 21 && userTotal > 21) {
      resultat = 'Égalité (les deux dépassent 21)';
    } else if (userTotal > 21) {
      resultat = 'Perdu (tu dépasses 21)';
    } else if (scoreOrdi > 21) {
      resultat = 'Gagné (l\'ordi dépasse 21)';
    } else if (userTotal > scoreOrdi) {
      resultat = 'Gagné';
    } else if (userTotal < scoreOrdi) {
      resultat = 'Perdu';
    } else {
      resultat = 'Égalité';
    }

    // On renvoie les résultats au client
    return res.json({ 
      cpuTotal: scoreOrdi, 
      cpuDraws: cartesPiochees, 
      status: resultat 
    });
  }

  // Si l'action n'est ni "play" ni "stop", erreur
  res.status(400).json({ error: 'action requise: "play" ou "stop"' });
});

// On exporte le router pour l'utiliser ailleurs
module.exports = router;