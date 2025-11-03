import { Routes, Route } from 'react-router'
import UserForm from './UserForm'
import BlackJack from './BlackJack'
import Question from './Question'
import Question2 from './Question2'
import './App.css'

// Composant principal avec les routes de l'application
function App() {
  return (
    <Routes>
      <Route path='userform' element={<UserForm/>}/>
      <Route path='blackjack' element={<BlackJack/>}/>
      <Route path='question' element={<Question/>}/>
      <Route path='question2' element={<Question2/>}/>
    </Routes>
  )
}

export default App
