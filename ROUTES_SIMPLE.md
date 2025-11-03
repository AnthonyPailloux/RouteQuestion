# Routes - Guide Simple

## 🎯 En 2 Minutes

Quand vous tapez une URL, voici ce qui se passe :

1. **Frontend** (React) : Affiche la page
2. **Frontend** : Demande les données à l'API
3. **Backend** (Express) : Cherche les données et les renvoie
4. **Frontend** : Affiche les données

---

## 📍 Exemple : `/question`

### Étape 1 : Le navigateur affiche la page

```
Vous tapez : http://localhost:5173/question
→ React Router dit : "Affiche le composant Question"
```

### Étape 2 : Le composant demande les données

```jsx
// Question.jsx
fetch('http://localhost:3000/question/1')
```

### Étape 3 : Le serveur cherche la question

```javascript
// index.js → question.route.js
req.params.id = "1"
questions["1"] → Trouve la question
```

### Étape 4 : Le serveur renvoie la question

```javascript
res.json(question) → Envoie au frontend
```

### Étape 5 : Le frontend affiche

```jsx
setExo(data) → La question s'affiche
```

---

## 🔄 Schéma Simple

```
Navigateur (/question)
    ↓
React Router (affiche Question.jsx)
    ↓
Question.jsx (appelle /question/1)
    ↓
index.js (envoie à question.route.js)
    ↓
question.route.js (cherche dans questions.js)
    ↓
Retourne JSON → Question.jsx affiche
```

---

## 📂 Les 3 Fichiers Clés

### 1. `index.js` - Le distributeur
```javascript
app.use('/question', questionRouter);
```
→ Dit : "Toutes les requêtes /question → va dans question.route.js"

### 2. `question.route.js` - Le spécialiste
```javascript
router.get('/:id', ...);
```
→ Dit : "Quand on arrive ici, récupère l'ID et trouve la question"

### 3. `questions.js` - Les données
```javascript
const questions = { "1": {...}, "2": {...} };
```
→ Dit : "Voici toutes les questions stockées"

---

## 🎯 Les Routes Frontend vs Backend

| Type | URL | Rôle |
|------|-----|------|
| **Frontend** | `localhost:5173/question` | Affiche la page |
| **Backend** | `localhost:3000/question/1` | Donne les données |

→ Le frontend demande, le backend répond.

---

## ✅ Résumé Ultra-Simple

**Frontend :** "Je veux la question 1"  
**Backend :** "Voici la question 1"  
**Frontend :** "Merci, je l'affiche"

C'est tout ! 🎉

