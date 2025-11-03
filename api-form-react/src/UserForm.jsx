import { useState } from "react";

// Formulaire d'inscription utilisateur
function UserForm(){
    const [pseudo, setPseudo] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ageNum = Number(age);
        const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        const isValid = pseudo.trim().length > 0 && Number.isInteger(ageNum) && ageNum > 0 && isEmail(email) && password.length >= 6;

        // Validation du formulaire
        if (!isValid) {
            return setError("Merci de corriger le formulaire (pseudo, âge, email, mot de passe ≥ 6).");
        }

        try {
            const res = await fetch("http://localhost:3000/userForm", { 
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ 
                    pseudo: pseudo.trim(),
                    age: ageNum,
                    email: email.trim(),
                    password
                }),
            });
            const data = await res.json();
            setResult(data);
            setPseudo("");
            setAge("");
            setEmail("");
            setPassword("");
        } catch(error) {
            console.error("erreur :", error);
        }
    }




    return (
        <div>
            <h2>Formulaire d'inscription</h2>
            <form className="user-form" onSubmit={handleSubmit}>
                <input type="text" name="pseudo" placeholder="Ecrire un pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)}/>
                <input type="number" name="age" placeholder="Renseigner votre âge" value={age} onChange={(e) => setAge(e.target.value)}/>
                <input type="email" name="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Votre mot de passe: min 6 caractères" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" />
            </form>
        </div>
    )
}
export default UserForm;