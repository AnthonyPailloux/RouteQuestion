import { useState } from "react";
import './BlackJack.css';

function BlackJack(){
  const [scoreJoueur, setScoreJoueur] = useState(0);
  const [scoreOrdi, setScoreOrdi] = useState(0);
  const [historique, setHistorique] = useState([]);
  const [statut, setStatut] = useState('En cours');

  const piocherCarte = async () => {
    if (statut !== 'En cours') return; 
    
    try {
        const res = await fetch('http://localhost:3000/blackjack', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ action: 'play', userTotal: scoreJoueur, cpuTotal: scoreOrdi })
        });
        const data = await res.json();

        // Met à jour les scores et l'historique
        setScoreJoueur(data.userTotal);
        setScoreOrdi(data.cpuTotal);
        const nouvelleEntree = "Joueur: +" + data.userCard + " (" + data.userTotal + ") | Ordi: +" + data.cpuCard + " (" + data.cpuTotal + ")";
        setHistorique(ancienHistorique => [...ancienHistorique, nouvelleEntree]);
        setStatut(data.status);
    } catch (erreur) {
        console.error(erreur);
        setHistorique(h => [...h, 'Erreur réseau/API']);
    }
  };

  const arreterDePiocher = async () => {
    if (statut !== 'En cours') return;
    
    try {
        const res = await fetch('http://localhost:3000/blackjack', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ action: 'stop', userTotal: scoreJoueur, cpuTotal: scoreOrdi })
        });
        const data = await res.json();

        // Affiche les cartes piochées par l'ordi
        if (data.cpuDraws && data.cpuDraws.length > 0) {
          const cartesOrdi = data.cpuDraws.join(', ');
          const nouvelleEntree = "Ordi pioche: " + cartesOrdi + " (total " + data.cpuTotal + ")";
          setHistorique(ancienHistorique => [...ancienHistorique, nouvelleEntree]);
        }
        
        setScoreOrdi(data.cpuTotal);
        setStatut(data.status);
    } catch (erreur) {
        console.error(erreur);
        setHistorique(h => [...h, 'Erreur réseau/API']);
    }
  };

  const recommencer = () => { 
    setScoreJoueur(0);
    setScoreOrdi(0);
    setHistorique([]);
    setStatut('En cours');
  };

  return (
    <div className="blackjack-container">
      <h2>Mini Blackjack</h2>
      
      <p><strong>Joueur :</strong> {scoreJoueur}</p>
      <p><strong>Ordi :</strong> {scoreOrdi}</p>
      <p><strong>Statut :</strong> {statut}</p>
      
      <div className="blackjack-buttons">
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