// Données des questions
const questions = {
  "1": {
    question: "L'eau bout-elle à 100 degrés Celsius ?",
    good: "oui", 
    // Options disponibles pour les questions à choix multiples
    options: ["oui", "non", "je ne sais pas"] 
  },

  "2": {
    question: "Quelle est la capitale de la France ?",
    // Pas de "options" car l'utilisateur doit taper sa réponse dans un input
    good: "Paris" 
  }
};


module.exports = questions;

