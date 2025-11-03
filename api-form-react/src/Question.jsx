import { useState, useEffect } from "react";

// Composant qui affiche une question
function Question() {
    const [message, setMessage] = useState("");
    const [exo, setExo] = useState(null);

    // Charge la question depuis l'API au chargement
    useEffect(() => {
        async function load() {
            // Effectue une requête HTTP GET à l'API pour récupérer la question n°1
            const res = await fetch('http://localhost:3000/question/1');
            // Attend la réponse et la convertit en objet JavaScript
            const data = await res.json();
            // Met à jour l'état du composant avec les données de la question
            setExo(data);
        }
        
        load();
    }, []);

    // Si la question n'est pas chargée affiche un message
    if (!exo) return <div>Chargement...</div>;

    return (
        <div>
            <h1>Exo question</h1>
            <p>{exo.question}</p>
            {exo.options.map((option) => (
                <button key={option} onClick={() => setMessage(option === exo.good ? "C'est bon !" : "C'est mauvais !")}>
                    {option}
                </button>
            ))}
            {message && <p>{message}</p>}
        </div>
    );
}

export default Question