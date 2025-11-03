import { useState, useEffect } from "react";

// Exercice 2 : Question avec input de réponse
function Question2() {
    const [message, setMessage] = useState("");
    const [input, setInput] = useState("");
    const [exo, setExo] = useState(null);

    // Charge la question depuis l'API au chargement
    useEffect(() => {
        async function load() {
            const res = await fetch('http://localhost:3000/question/2');
            const data = await res.json();
            setExo(data);
        }
        load();
    }, []);

    if (!exo) return <div>Chargement...</div>;

    return (
        <div>
            <h1>Exo question 2</h1>
            <p>{exo.question}</p>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écrivez votre réponse"/>
            {/* Vérifie la réponse et affiche le message */}
            <button onClick={() => setMessage(input === exo.good ? "C'est bon !" : "C'est mauvais !")}>Vérifier</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Question2

