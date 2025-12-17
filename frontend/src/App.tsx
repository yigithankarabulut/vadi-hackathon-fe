import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/LoginPage'
import HomePage from './pages/Home/HomePage'
import './App.css'
import { useUser } from './context/UserContext'

function App() {
  const { isLoggedIn } = useUser();
  
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

  )
}

export default App
