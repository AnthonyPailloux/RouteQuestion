# 🎰 Guide du Code BlackJack

## Vue d'ensemble

Ce jeu de blackjack simple fonctionne avec deux parties :
- **Frontend** (React) : L'interface utilisateur
- **Backend** (Express) : Le serveur qui gère la logique du jeu

Le joueur et l'ordinateur piochent des cartes (valeurs 1 à 11). Le but : s'approcher de 21 sans le dépasser !

---

## 📂 Architecture des fichiers

```
back-express/
├── index.js                    # Point d'entrée du serveur
└── routes/
    └── blackjack.route.js      # Logique du jeu de blackjack

api-form-react/src/
└── BlackJack.jsx               # Interface utilisateur
```

---

## 🚀 PARTIE 1 : Démarrage du Serveur

### Fichier : `back-express/index.js`

```1:9:back-express/index.js
//import d'express et de cors
const express = require('express');
const cors = require('cors');

//déclaration route pour le userForm

// const userForm = require('./routes/userForm.route');
const blackjackRouter = require('./routes/blackjack.route')
```

**Explication :**
- Import de `express` (serveur HTTP)
- Import de `cors` (autorise les requêtes de React vers Express)
- Import du routeur BlackJack

```11:16:back-express/index.js
//création de l'app
const app = express();
const PORT = 3000;

//middleware
app.use(express.json());
app.use(cors());
```

**Explication :**
- Création de l’app
- `express.json()` : parse JSON reçu
- `cors()` : autorise les requêtes cross-origin

```18:25:back-express/index.js
//routes
// app.use('/userForm', userForm);
app.use('/blackjack', blackjackRouter);

//démarrage du serveur sur le port 3000
app.listen(3000, ()=>{
    console.log("Application bien lancé sur le port" + PORT);
})
```

**Explication :**
- Montage du routeur BlackJack sur `/blackjack`
- Démarrage du serveur sur le port 3000
- Toute requête vers `http://localhost:3000/blackjack` sera gérée par `blackjack.route.js`

---

## 🎲 PARTIE 2 : Route BlackJack (Backend)

### Fichier : `back-express/routes/blackjack.route.js`

```1:9:back-express/routes/blackjack.route.js
// Import de la bibliothèque express
const express = require("express")
// Création d'un router pour gérer les routes
const router = express.Router();

// Fonction qui tire une carte aléatoire (valeur entre 1 et 11)
const tirerCarte = () => {
  return Math.floor(Math.random() * 11) + 1;
}
```

**Explication :**
- `Router()` : groupe les routes
- `tirerCarte()` : renvoie 1–11

```11:14:back-express/routes/blackjack.route.js
// Route POST : reçoit les actions du client
router.post('/', (req, res) => {
  // On récupère l'action et les scores actuels
  const { action, userTotal = 0, cpuTotal = 0 } = req.body;
```

**Explication :**
- `POST /` : reçoit les actions
- `req.body` : données JSON
- `action` : `'play'` ou `'stop'`
- `userTotal`, `cpuTotal` : scores actuels

**Exemple de données reçues :**
```json
{
  "action": "play",
  "userTotal": 5,
  "cpuTotal": 8
}
```

#### Action "PLAY" : piocher des cartes

```16:24:back-express/routes/blackjack.route.js
  // === ACTION "JOUER" : Piocher des cartes ===
  if (action === 'play') {
    // On tire une carte pour le joueur et pour l'ordi
    const carteJoueur = tirerCarte();
    const carteOrdi = tirerCarte();
    
    // On calcule les nouveaux scores
    const nouveauScoreJoueur = userTotal + carteJoueur;
    const nouveauScoreOrdi = cpuTotal + carteOrdi;
```

**Explication :**
- Deux cartes, totaux mis à jour

**Exemple :**
```
Avant : userTotal = 5, cpuTotal = 8
Cartes tirées : carteJoueur = 3, carteOrdi = 7
Après : nouveauScoreJoueur = 8, nouveauScoreOrdi = 15
```

```26:34:back-express/routes/blackjack.route.js
    // On détermine le statut de la partie
    let statut = 'En cours';
    if (nouveauScoreJoueur > 21 && nouveauScoreOrdi > 21) {
      statut = 'Égalité (les deux dépassent 21)';
    } else if (nouveauScoreJoueur > 21) {
      statut = 'Perdu (tu dépasses 21)';
    } else if (nouveauScoreOrdi > 21) {
      statut = 'Gagné (l\'ordi dépasse 21)';
    }
```

**Explication :**
- Si > 21 : dépassement
- Sinon, la partie continue

```36:43:back-express/routes/blackjack.route.js
    // On renvoie les résultats au client
    return res.json({ 
      userCard: carteJoueur, 
      cpuCard: carteOrdi, 
      userTotal: nouveauScoreJoueur, 
      cpuTotal: nouveauScoreOrdi, 
      status: statut 
    });
```

**Explication :**
- Réponse JSON

**Exemple de réponse :**
```json
{
  "userCard": 3,
  "cpuCard": 7,
  "userTotal": 8,
  "cpuTotal": 15,
  "status": "En cours"
}
```

#### Action "STOP" : terminer la partie

```46:56:back-express/routes/blackjack.route.js
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
```

**Explication :**
- L’ordi pioche jusqu’à ≥17
- `while` : boucle tant que score < 17

**Exemple :**
```
scoreOrdi = 12
Tour 1 : carte = 3 → scoreOrdi = 15
Tour 2 : carte = 5 → scoreOrdi = 20 (stop car ≥ 17)
cartesPiochees = [3, 5]
```

```58:72:back-express/routes/blackjack.route.js
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
```

**Explication :**
- Cas possibles : dépassements, comparaison ou égalité

```74:79:back-express/routes/blackjack.route.js
    // On renvoie les résultats au client
    return res.json({ 
      cpuTotal: scoreOrdi, 
      cpuDraws: cartesPiochees, 
      status: resultat 
    });
```

**Exemple de réponse :**
```json
{
  "cpuTotal": 20,
  "cpuDraws": [3, 5],
  "status": "Perdu"
}
```

```82:87:back-express/routes/blackjack.route.js
  // Si l'action n'est ni "play" ni "stop", erreur
  res.status(400).json({ error: 'action requise: "play" ou "stop"' });
});

// On exporte le router pour l'utiliser ailleurs
module.exports = router;
```

**Explication :**
- Action invalide → 400
- Export du routeur pour `index.js`

---

## 🎨 PARTIE 3 : Interface React (Frontend)

### Fichier : `api-form-react/src/BlackJack.jsx`

```1:10:api-form-react/src/BlackJack.jsx
import React from "react";
import { useState } from "react";

// Composant jeu de blackjack simplifié
function BlackJack(){
  // États : variables qui stockent les informations du jeu
  const [scoreJoueur, setScoreJoueur] = useState(0);  // Score du joueur
  const [scoreOrdi, setScoreOrdi] = useState(0);      // Score de l'ordinateur
  const [historique, setHistorique] = useState([]);   // Liste des actions passées
  const [statut, setStatut] = useState('En cours');   // État de la partie
```

**Explication :**
- États en mémoire du composant

#### Fonction "Piocher une carte"

```12:43:api-form-react/src/BlackJack.jsx
  // Fonction qui pioche une carte (action "Choisir")
  const piocherCarte = async () => {
    if (statut !== 'En cours') return; // Si partie terminée, on bloque
    
    try {
        // On demande au serveur de piocher des cartes
        const reponse = await fetch('http://localhost:3000/blackjack', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ action: 'play', userTotal: scoreJoueur, cpuTotal: scoreOrdi })
        });
        
        // On récupère les données du serveur
        const donnees = await reponse.json();

        // On met à jour les scores avec les nouvelles valeurs
        setScoreJoueur(donnees.userTotal);
        setScoreOrdi(donnees.cpuTotal);
        
        // On ajoute cette action dans l'historique
        const nouvelleEntree = `Joueur: +${donnees.userCard} (${donnees.userTotal}) | Ordi: +${donnees.cpuCard} (${donnees.cpuTotal})`;
        setHistorique(ancienHistorique => [...ancienHistorique, nouvelleEntree]);
        
        // On met à jour le statut
        setStatut(donnees.status);
        
    } catch (erreur) {
        // En cas d'erreur (serveur down, réseau...)
        console.error(erreur);
        setHistorique(h => [...h, 'Erreur réseau/API']);
    }
  };
```

**Explication :**
- `async/await` : attend la réponse
- `POST /blackjack` : envoie l’action et les scores
- `try/catch` : gère les erreurs
- Mise à jour des états depuis la réponse

**Exemple concret :**
```
1. Clic sur "Choisir"
2. Envoi : { action: "play", userTotal: 5, cpuTotal: 8 }
3. Réponse : { userCard: 3, cpuCard: 7, userTotal: 8, cpuTotal: 15, status: "En cours" }
4. États mis à jour : scores (8, 15), historique ajouté, statut "En cours"
5. Interface mise à jour
```

#### Fonction "Arrêter de piocher"

```45:77:api-form-react/src/BlackJack.jsx
  // Fonction qui arrête de piocher (action "Stop")
  const arreterDePiocher = async () => {
    if (statut !== 'En cours') return; // Si partie terminée, on bloque
    
    try {
        // On demande au serveur de terminer la partie
        const reponse = await fetch('http://localhost:3000/blackjack', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ action: 'stop', userTotal: scoreJoueur, cpuTotal: scoreOrdi })
        });
        
        // On récupère les données du serveur
        const donnees = await reponse.json();

        // Si l'ordi a pioché des cartes, on les affiche
        if (donnees.cpuDraws && donnees.cpuDraws.length > 0) {
          const cartesOrdi = donnees.cpuDraws.join(', ');
          const nouvelleEntree = `Ordi pioche: ${cartesOrdi} (total ${donnees.cpuTotal})`;
          setHistorique(ancienHistorique => [...ancienHistorique, nouvelleEntree]);
        }
        
        // On met à jour le score de l'ordi
        setScoreOrdi(donnees.cpuTotal);
        
        // On met à jour le statut final
        setStatut(donnees.status);
        
    } catch (erreur) {
        console.error(erreur);
        setHistorique(h => [...h, 'Erreur réseau/API']);
    }
  };
```

**Explication :**
- Envoie `action: 'stop'`
- L’ordi joue côté serveur
- Historique et statut mis à jour

**Exemple :**
```
1. Clic sur "Stop"
2. Envoi : { action: "stop", userTotal: 15, cpuTotal: 12 }
3. Serveur : ordi pioche 3, 5 → scoreOrdi = 20
4. Réponse : { cpuTotal: 20, cpuDraws: [3, 5], status: "Perdu" }
5. États mis à jour : cpuTotal = 20, historique ajouté, statut "Perdu"
```

#### Fonction "Recommencer"

```79:85:api-form-react/src/BlackJack.jsx
  // Fonction qui recommence une partie
  const recommencer = () => { 
    setScoreJoueur(0);
    setScoreOrdi(0);
    setHistorique([]);
    setStatut('En cours');
  };
```

**Explication :**
- Réinitialise les états

#### Rendu de l'interface

```87:115:api-form-react/src/BlackJack.jsx
  // Rendu de l'interface
  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h2>Mini Blackjack</h2>
      
      <p><strong>Joueur :</strong> {scoreJoueur}</p>
      <p><strong>Ordi :</strong> {scoreOrdi}</p>
      <p><strong>Statut :</strong> {statut}</p>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={piocherCarte} disabled={statut !== 'En cours'}>
          Choisir
        </button>
        <button onClick={arreterDePiocher} disabled={statut !== 'En cours'}>
          Stop
        </button>
        <button onClick={recommencer}>
          Rejouer
        </button>
      </div>
      
      <ul>
        {historique.map((ligne, index) => (
          <li key={index}>{ligne}</li>
        ))}
      </ul>
    </div>
  );
}

export default BlackJack;
```

**Explication :**
- Affichage scores et statut
- Boutons : Choisir / Stop / Rejouer (Choisir/Stop désactivés si terminé)
- Historique rendu avec `map`

---

## 🔄 Flux complet d'une partie

### Scénario : une partie complète

**État initial :**
```
Scores : Joueur = 0, Ordi = 0
Statut : En cours
Historique : []
Boutons : Choisir ✓, Stop ✓, Rejouer ✓
```

**Tour 1 - Clic sur "Choisir" :**

```
1️⃣ React : piocherCarte() est appelée
2️⃣ Fetch POST → http://localhost:3000/blackjack
   Body : { action: "play", userTotal: 0, cpuTotal: 0 }

3️⃣ Serveur : blackjack.route.js reçoit la requête
   - action === 'play' → on entre dans le premier if
   - carteJoueur = tirerCarte() = 5
   - carteOrdi = tirerCarte() = 8
   - nouveauScoreJoueur = 0 + 5 = 5
   - nouveauScoreOrdi = 0 + 8 = 8
   - statut = 'En cours' (personne ne dépasse 21)
   - Retourne : { userCard: 5, cpuCard: 8, userTotal: 5, cpuTotal: 8, status: "En cours" }

4️⃣ React : reçoit les données
   - setScoreJoueur(5)
   - setScoreOrdi(8)
   - setHistorique(["Joueur: +5 (5) | Ordi: +8 (8)"])
   - setStatut("En cours")

5️⃣ React : re-rend l'interface
   - Affiche : Joueur: 5, Ordi: 8
   - Affiche l'historique avec 1 ligne
```

**État après Tour 1 :**
```
Scores : Joueur = 5, Ordi = 8
Statut : En cours
Historique : ["Joueur: +5 (5) | Ordi: +8 (8)"]
Boutons : Choisir ✓, Stop ✓
```

**Tour 2 - Clic sur "Choisir" :**

```
1️⃣ React : piocherCarte() avec scores actuels (5, 8)
2️⃣ Fetch POST → Serveur
   Body : { action: "play", userTotal: 5, cpuTotal: 8 }

3️⃣ Serveur :
   - carteJoueur = 7, carteOrdi = 3
   - nouveauScoreJoueur = 5 + 7 = 12
   - nouveauScoreOrdi = 8 + 3 = 11
   - Retourne : { userCard: 7, cpuCard: 3, userTotal: 12, cpuTotal: 11, status: "En cours" }

4️⃣ React : met à jour
   - Scores : (12, 11)
   - Historique : [..., "Joueur: +7 (12) | Ordi: +3 (11)"]

État : Joueur = 12, Ordi = 11
```

**Tour 3 - Clic sur "Stop" :**

```
1️⃣ React : arreterDePiocher() est appelée
2️⃣ Fetch POST → Serveur
   Body : { action: "stop", userTotal: 12, cpuTotal: 11 }

3️⃣ Serveur : action === 'stop' → second if
   - scoreOrdi = 11
   - Boucle while : 11 < 17 ?
     Tour 1 : carte = 3, scoreOrdi = 14
     Tour 2 : carte = 5, scoreOrdi = 19 (> 17, stop)
   - cartesPiochees = [3, 5]
   - Détermination du gagnant : 12 < 19 → resultat = 'Perdu'
   - Retourne : { cpuTotal: 19, cpuDraws: [3, 5], status: "Perdu" }

4️⃣ React : reçoit les données
   - setHistorique([..., "Ordi pioche: 3, 5 (total 19)"])
   - setScoreOrdi(19)
   - setStatut("Perdu")

5️⃣ React : re-rend
   - Boutons "Choisir" et "Stop" désactivés
   - Affiche : Statut : Perdu
```

**État final :**
```
Scores : Joueur = 12, Ordi = 19
Statut : Perdu
Historique : [3 lignes]
Boutons : Choisir ✗, Stop ✗, Rejouer ✓
```

**Clic sur "Rejouer" :**

```
React : recommencer()
- setScoreJoueur(0)
- setScoreOrdi(0)
- setHistorique([])
- setStatut('En cours')
- Boutons réactivés
```

---

## 🎯 Points clés à retenir

**Concept 1 : Communication Client-Serveur**
- Le client (React) envoie des requêtes HTTP POST
- Le serveur (Express) calcule et renvoie des données JSON
- Le client met à jour l'interface à partir de la réponse

**Concept 2 : Gestion d'État React**
- `useState` pour stocker les données
- Mettre à jour via `setNomFonction()`
- Chaque changement provoque un re-render

**Concept 3 : Asynchrone**
- `async/await` pour attendre les réponses
- `fetch` est asynchrone
- `try/catch` pour gérer les erreurs

**Concept 4 : Séparation des responsabilités**
- Frontend : interface et interactions utilisateur
- Backend : logique métier et calculs

---

## 🧪 Tester le code

**1. Démarrer le serveur :**
```bash
cd back-express
node index.js
```

**2. Démarrer React :**
```bash
cd api-form-react
npm run dev
```

**3. Ouvrir le navigateur :**
```
http://localhost:5173/blackjack
```

**4. Jouer :**
- Cliquer "Choisir" plusieurs fois
- Observer les scores et l'historique
- Cliquer "Stop" pour finir
- Cliquer "Rejouer" pour recommencer

---

**Document créé pour comprendre le code du jeu de BlackJack ! 🎰**

