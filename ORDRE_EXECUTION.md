# Ordre d'Exécution du Code

## 📍 Quand le code s'exécute

### ÉTAPE 1 : Démarrage du Serveur (Backend)

**Fichier :** `back-express/index.js`

Quand vous lancez le serveur avec `node index.js` ou `npm run dev`, voici ce qui se passe **DANS L'ORDRE** :

```javascript
// 1. D'abord, on charge les modules
const express = require('express');
const cors = require('cors');
const questionRouter = require('./routes/question.route')  // ← Charge question.route.js

// 2. Ensuite, on crée l'application
const app = express();
const PORT = 3000;

// 3. Puis, on configure les middlewares (toujours appliqués)
app.use(express.json());  // ← S'exécute pour TOUTES les requêtes
app.use(cors());          // ← S'exécute pour TOUTES les requêtes

// 4. Enfin, on configure les routes (préparation pour plus tard)
app.use('/question', questionRouter);  // ← Dit : "si /question arrive → va dans questionRouter"

// 5. Le serveur écoute et attend les requêtes
app.listen(PORT, () => {
    console.log("Application bien lancé sur le port", PORT);
})
```

**Résumé :** Le serveur se prépare et attend. Il ne fait rien de plus pour l'instant.

---

### ÉTAPE 2 : Quand une Requête Arrive

**Exemple :** Le frontend fait `fetch('http://localhost:3000/question/1')`

**L'ordre d'exécution :**

#### 2.1 : Dans `index.js` (automatique)

```javascript
// Express reçoit la requête : GET /question/1
// Il passe d'abord par les middlewares (dans l'ordre)
app.use(express.json());  // ← S'exécute en PREMIER
app.use(cors());          // ← S'exécute en DEUXIÈME

// Puis Express regarde les routes
app.use('/question', questionRouter);  // ← "Ça commence par /question → va dans questionRouter"
```

#### 2.2 : Dans `question.route.js` (automatique)

```javascript
// Express arrive ici avec la requête
router.get('/:id', (req, res) => {
  // ÉTAPE 1 : Récupère l'ID depuis l'URL
  const question = questions[req.params.id];  // ← questions["1"]
  
  // ÉTAPE 2 : Vérifie si la question existe
  if (question) {
    // ÉTAPE 3a : Question trouvée → on renvoie
    res.json(question);
  } else {
    // ÉTAPE 3b : Question non trouvée → erreur 404
    res.status(404).json({ error: 'Question non trouvée' });
  }
});
```

**Ordre dans `question.route.js` :**
1. **Ligne 8** : Récupère l'ID → `questions[req.params.id]`
2. **Ligne 11** : Vérifie si `question` existe (si elle n'est pas `undefined`)
3. **Ligne 13** OU **Ligne 16** : Renvoie soit la question, soit l'erreur

---

### ÉTAPE 3 : Quand le Frontend Charge

**Fichier :** `api-form-react/src/Question.jsx`

Quand l'utilisateur accède à `/question` dans son navigateur :

```javascript
// ÉTAPE 1 : Le composant se monte (s'affiche)
function Question() {
    const [message, setMessage] = useState("");      // ← État initial
    const [exo, setExo] = useState(null);            // ← État initial (pas de question)
    
    // ÉTAPE 2 : useEffect s'exécute UNE FOIS au chargement
    useEffect(() => {
        async function load() {
            // ÉTAPE 2a : Fait la requête
            const res = await fetch('http://localhost:3000/question/1');
            // ÉTAPE 2b : Attend la réponse et la convertit
            const data = await res.json();
            // ÉTAPE 2c : Met à jour l'état (déclenche un re-rendu)
            setExo(data);
        }
        load();  // ← Lance la fonction
    }, []);  // ← [] signifie "une seule fois au début"
    
    // ÉTAPE 3 : Vérifie si exo existe (au premier rendu, exo = null)
    if (!exo) return <div>Chargement...</div>;  // ← Affiche "Chargement..."
    
    // ÉTAPE 4 : Quand exo est mis à jour (après la réponse), React re-rend
    // Maintenant exo contient les données, on affiche la question
    return (
        <div>
            <h1>Exo question</h1>
            <p>{exo.question}</p>
            {exo.options.map(...)}
        </div>
    );
}
```

**Ordre dans `Question.jsx` :**
1. **Lignes 5-6** : Initialise les états
2. **Ligne 9** : `useEffect` s'exécute
3. **Ligne 23** : Premier rendu → `exo` est `null` → affiche "Chargement..."
4. **Ligne 16** : `setExo(data)` met à jour l'état
5. **React re-rend** : Maintenant `exo` existe → affiche la question

---

## 🔄 Résumé de l'Ordre Complet

### Au Démarrage (une seule fois)
```
1. index.js se charge
2. index.js charge question.route.js
3. index.js configure les middlewares
4. index.js configure les routes
5. index.js démarre le serveur → attend
```

### Quand une Requête Arrive
```
1. index.js : Middleware express.json() s'exécute
2. index.js : Middleware cors() s'exécute
3. index.js : Route /question → envoie vers question.route.js
4. question.route.js : Récupère l'ID (ligne 8)
5. question.route.js : Vérifie si existe (ligne 11)
6. question.route.js : Renvoie la réponse (ligne 13 ou 16)
```

### Quand le Frontend Charge
```
1. Question.jsx : Composant se monte
2. Question.jsx : États initialisés (lignes 5-6)
3. Question.jsx : useEffect s'exécute (ligne 9)
4. Question.jsx : Affiche "Chargement..." (ligne 23)
5. fetch() : Fait la requête au backend
6. Backend : Répond (voir ci-dessus)
7. Question.jsx : setExo(data) met à jour (ligne 16)
8. React : Re-rend le composant
9. Question.jsx : Affiche la question (ligne 25-36)
```

---

## 🎯 Points Clés

1. **`index.js`** s'exécute EN PREMIER au démarrage
2. **`question.route.js`** s'exécute QUAND une requête arrive
3. **`Question.jsx`** s'exécute QUAND l'utilisateur accède à la page

**Ordre chronologique :**
```
Serveur démarre → Attend → Requête arrive → question.route.js traite → Réponse
                                                              ↓
Frontend charge → useEffect → fetch() → Attend réponse → Affiche
```

