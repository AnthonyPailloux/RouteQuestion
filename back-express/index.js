// Serveur Express principal
// Point d'entrée 
const express = require('express');
const cors = require('cors');
const blackjackRouter = require('./routes/blackjack.route')
const questionRouter = require('./routes/question.route')

// Création de l'application Express
const app = express();
const PORT = 3000;

// Middlewares : configurations appliquées à toutes les routes
// Permet de parser les données JSON dans les requêtes
app.use(express.json()); 
// Autorise les requêtes depuis le frontend
app.use(cors()); 

// Configuration des routes
app.use('/blackjack', blackjackRouter);
app.use('/question', questionRouter);


app.listen(PORT, () => {
    console.log("Application bien lancé sur le port", PORT);
})

