import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AuthHomePage from './components/AuthHomePage';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import AddTask from './components/AddTask';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/login" element={
          <AuthHomePage>
            <LoginModal />
          </AuthHomePage>
        } />

        <Route path="/signup" element={
          <AuthHomePage>
            <SignupModal />
          </AuthHomePage>
        } />

        <Route path="/add" element={
          <ProtectedRoute>
            <AddTask />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
