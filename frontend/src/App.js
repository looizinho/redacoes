import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import RedacaoPage from './pages/RedacaoPage';
import RedacaoListPage from './pages/RedacaoListPage';
import RedacaoDisplayPage from './pages/RedacaoDisplayPage';
import DashboardPage from './pages/DashboardPage';
import PainelControlePage from './pages/PainelControlePage';
import PainelAdministradorPage from './pages/PainelAdministradorPage';
import PainelCoordenadorPage from './pages/PainelCoordenadorPage';
import PainelProfessorPage from './pages/PainelProfessorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/redacao/nova" element={<RedacaoPage />} />
        <Route path="/redacao/editar/:id" element={<RedacaoPage mode="edit" />} />
        <Route path="/redacao/exibir/:id" element={<RedacaoDisplayPage />} />
        <Route path="/redacao/lista" element={<RedacaoListPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/painel-de-controle" element={<PainelControlePage />} />
        <Route path="/painel/administrador" element={<PainelAdministradorPage />} />
        <Route path="/painel/coordenador" element={<PainelCoordenadorPage />} />
        <Route path="/painel/professor" element={<PainelProfessorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
