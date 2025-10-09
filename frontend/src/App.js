import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import RedacaoPage from './pages/RedacaoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/redacao" element={<RedacaoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
