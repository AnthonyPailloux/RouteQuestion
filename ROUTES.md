# Cheminement des Routes - Guide Complet

## 🎯 Introduction

Quand vous cliquez sur un lien ou tapez une URL dans votre navigateur, que se passe-t-il exactement ? Ce document explique étape par étape comment une requête voyage du frontend (votre interface React) jusqu'au backend (le serveur Express) et revient avec les données.

---

## 📚 Les Deux Types de Routes

### 1. Routes Frontend (React Router)
Ce sont les URLs que vous voyez dans votre navigateur.
- `http://localhost:5173/question` → Affiche le composant Question
- `http://localhost:5173/question2` → Affiche le composant Question2

**Où c'est défini :** `api-form-react/src/App.jsx`

### 2. Routes Backend (Express)
Ce sont les URLs de l'API que le frontend appelle pour obtenir des données.
- `http://localhost:3000/question/1` → Retourne la question n°1
- `http://localhost:3000/question/2` → Retourne la question n°2

**Où c'est défini :** `back-express/index.js` et `back-express/routes/question.route.js`

---

## 🚀 Exemple Concret : Quand vous accédez à `/question`

Suivons pas à pas ce qui se passe quand vous ouvrez `http://localhost:5173/question` dans votre navigateur.

### ÉTAPE 1 : Votre navigateur fait une demande

```
Vous tapez : http://localhost:5173/question
```

**Ce qui se passe :**
- Votre navigateur demande la page `/question`
- Le serveur React (port 5173) reçoit cette demande

---

### ÉTAPE 2 : React Router choisit le composant

**Fichier :** `api-form-react/src/App.jsx`

```jsx
<Routes>
  <Route path='question' element={<Question/>}/>
  <Route path='question2' element={<Question2/>}/>
</Routes>
```

**Ce qui se passe :**
- React Router regarde l'URL : `/question`
- Il trouve la route correspondante : `path='question'`
- Il affiche le composant : `<Question/>`

👉 **Résultat :** Le composant `Question` s'affiche à l'écran

---

### ÉTAPE 3 : Le composant charge les données

**Fichier :** `api-form-react/src/Question.jsx`

Le composant `Question` a besoin de la question pour l'afficher. Il va la chercher dans l'API :

```jsx
useEffect(() => {
    async function load() {
        const res = await fetch('http://localhost:3000/question/1');
        const data = await res.json();
        setExo(data);
    }
    load();
}, []);
```

**Ce qui se passe :**
1. Quand le composant s'affiche (`useEffect`), il lance la fonction `load()`
2. Cette fonction fait un appel HTTP : `fetch('http://localhost:3000/question/1')`
3. Elle attend la réponse du serveur backend

👉 **Résultat :** Une requête HTTP GET est envoyée vers `http://localhost:3000/question/1`

---

### ÉTAPE 4 : Le serveur Express reçoit la requête

**Fichier :** `back-express/index.js`

Le serveur Express écoute sur le port 3000. Quand il reçoit une requête pour `/question/1`, il fait ceci :

```javascript
app.use('/question', questionRouter);
```

**Ce qui se passe :**
- Express reçoit : `/question/1`
- Il voit que ça commence par `/question`
- Il envoie la requête au router des questions : `questionRouter`

👉 **Résultat :** La requête est transférée au fichier `question.route.js`

---

### ÉTAPE 5 : La route dynamique extrait l'ID

**Fichier :** `back-express/routes/question.route.js`

Dans ce fichier, il y a une route avec un paramètre `:id` :

```javascript
router.get('/:id', (req, res) => {
  const question = questions[req.params.id];
  // ...
});
```

**Ce qui se passe :**
- La route `/question/1` arrive ici
- `/:id` signifie "un paramètre dynamique appelé id"
- Express extrait `1` et le met dans `req.params.id`
- Donc `req.params.id = "1"`

👉 **Résultat :** On sait maintenant qu'on veut la question numéro `1`

---

### ÉTAPE 6 : On récupère la question dans les données

**Fichier :** `back-express/routes/question.route.js`

```javascript
const questions = require('../data/questions');
const question = questions[req.params.id];
```

**Fichier :** `back-express/data/questions.js`

```javascript
const questions = {
  1: {
    question: "L'eau bout-elle à 100 degrés Celsius ?",
    good: "oui",
    options: ["oui", "non", "je ne sais pas"]
  },
  2: {
    question: "Quelle est la capitale de la France ?",
    good: "Paris"
  }
};
```

**Ce qui se passe :**
1. On charge le fichier `questions.js` qui contient toutes les questions
2. On cherche la question avec l'ID `"1"` : `questions["1"]`
3. On trouve : `{ question: "...", good: "oui", options: [...] }`

👉 **Résultat :** La question est trouvée et stockée dans la variable `question`

---

### ÉTAPE 7 : Le serveur renvoie les données

**Fichier :** `back-express/routes/question.route.js`

```javascript
if (question) {
    res.json(question);
} else {
    res.status(404).json({ error: 'Question non trouvée' });
}
```

**Ce qui se passe :**
- Si la question existe, on la renvoie au format JSON
- Si elle n'existe pas, on renvoie une erreur 404

👉 **Résultat :** Le serveur envoie : 
```json
{
  "question": "L'eau bout-elle à 100 degrés Celsius ?",
  "good": "oui",
  "options": ["oui", "non", "je ne sais pas"]
}
```

---

### ÉTAPE 8 : Le composant React reçoit les données

**Fichier :** `api-form-react/src/Question.jsx`

```jsx
const data = await res.json();  // On reçoit le JSON
setExo(data);                    // On met à jour l'état du composant
```

**Ce qui se passe :**
1. Le `await` attend que la réponse arrive
2. `res.json()` convertit le JSON en objet JavaScript
3. `setExo(data)` met à jour l'état du composant avec les données
4. React voit que l'état a changé et réaffiche le composant

👉 **Résultat :** La question et les boutons s'affichent à l'écran !

---

## 🔄 Schéma Visuel du Cheminement

```
┌─────────────────────────────────────────────────────────────┐
│ 1. NAVIGATEUR                                               │
│    http://localhost:5173/question                           │
│    ↓                                                         │
│ 2. REACT ROUTER (App.jsx)                                   │
│    Route trouvée → Affiche <Question/>                      │
│    ↓                                                         │
│ 3. COMPOSANT REACT (Question.jsx)                           │
│    useEffect → fetch('http://localhost:3000/question/1')    │
│    ↓                                                         │
│ 4. SERVEUR EXPRESS (index.js)                               │
│    app.use('/question', questionRouter)                      │
│    ↓                                                         │
│ 5. ROUTER QUESTION (question.route.js)                      │
│    router.get('/:id', ...) → req.params.id = "1"            │
│    ↓                                                         │
│ 6. DONNÉES (questions.js)                                   │
│    questions["1"] → Trouve la question                      │
│    ↓                                                         │
│ 7. RÉPONSE JSON                                              │
│    res.json(question) → Envoie au frontend                   │
│    ↓                                                         │
│ 8. COMPOSANT REACT                                           │
│    setExo(data) → Met à jour et affiche                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Structure des Fichiers Impliqués

```
back-express/
├── index.js                    # Étape 4 : Monte les routes
├── routes/
│   └── question.route.js       # Étape 5-7 : Gère les routes et répond
└── data/
    └── questions.js           # Étape 6 : Stocke les données

api-form-react/src/
├── App.jsx                    # Étape 2 : Définit les routes React
├── Question.jsx               # Étape 3 et 8 : Appelle l'API et affiche
└── Question2.jsx              # Même principe pour la question 2
```

---

## 🎯 Exemples Concrets

### Exemple 1 : Question 1 (avec boutons)

**URL Frontend :** `http://localhost:5173/question`

1. React Router affiche `<Question/>`
2. `Question.jsx` appelle `GET http://localhost:3000/question/1`
3. Backend trouve `questions[1]`
4. Retourne : `{ question: "...", good: "oui", options: [...] }`
5. Le composant affiche la question et 3 boutons

---

### Exemple 2 : Question 2 (avec input)

**URL Frontend :** `http://localhost:5173/question2`

1. React Router affiche `<Question2/>`
2. `Question2.jsx` appelle `GET http://localhost:3000/question/2`
3. Backend trouve `questions[2]`
4. Retourne : `{ question: "...", good: "Paris" }`
5. Le composant affiche la question et un champ input

---

## 🔑 Concepts Importants

### Route Dynamique

Au lieu d'avoir deux routes séparées :
- ❌ `/question/1` → route spécifique
- ❌ `/question/2` → route spécifique

On a une seule route dynamique :
- ✅ `/question/:id` → fonctionne pour tous les IDs

Le `:id` est un **paramètre** qui peut prendre n'importe quelle valeur :
- `/question/1` → `id = "1"`
- `/question/2` → `id = "2"`
- `/question/999` → `id = "999"`

### Séparation des Responsabilités

Chaque fichier a un rôle précis :

| Fichier | Rôle |
|---------|------|
| `App.jsx` | Décide quel composant afficher selon l'URL |
| `Question.jsx` | Affiche l'interface et demande les données |
| `index.js` | Dirige les requêtes vers les bons routers |
| `question.route.js` | Extrait l'ID et répond avec les données |
| `questions.js` | Stocke les données des questions |

### Flux de Données

Les données voyagent toujours dans le même sens :

```
Données → Backend → Réponse JSON → Frontend → Affichage
```

Les données sont dans `questions.js` (backend), jamais dans le frontend.

---

## ✅ Résumé en 3 Points

1. **Le frontend demande** : Le composant React fait un `fetch()` vers l'API
2. **Le backend répond** : Express trouve la route, récupère les données, renvoie un JSON
3. **Le frontend affiche** : Le composant reçoit les données et les affiche

C'est aussi simple que ça ! 🎉
