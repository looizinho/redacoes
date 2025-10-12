import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './PainelControlePage.css';
import {
  STORAGE_KEY,
  clearStoredUser,
  readCurrentUser,
} from '../services/authStorage';

function PainelControlePage() {
  const [user, setUser] = useState(() => readCurrentUser());

  useEffect(() => {
    const syncUser = () => {
      setUser(readCurrentUser());
    };

    const handleStorage = (event) => {
      if (event?.key && event.key !== STORAGE_KEY) {
        return;
      }
      syncUser();
    };

    window.addEventListener('md3-auth-change', syncUser);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('md3-auth-change', syncUser);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const displayName = useMemo(() => {
    if (!user) {
      return 'Visitante';
    }

    return (
      user?.nome ??
      user?.username ??
      user?.usernameFallback ??
      user?.normalizedUsername ??
      'Visitante'
    );
  }, [user]);

  const avatarUrl = useMemo(
    () =>
      user?.avatarUrl ??
      user?.credenciais?.picture ??
      user?.picture ??
      null,
    [user],
  );

  const initials = useMemo(() => {
    const source = displayName?.trim();
    if (!source) {
      return '??';
    }
    const parts = source.split(/\s+/).slice(0, 2);
    const letters = parts
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
    return letters || '??';
  }, [displayName]);

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
  };

  return (
    <div className="painel-controle-page">
      <header className="painel-controle-header">
        <div className="painel-controle-user">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`Avatar de ${displayName}`}
              className="painel-controle-avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="painel-controle-avatar painel-controle-avatar--fallback">
              {initials}
            </span>
          )}
          <div className="painel-controle-user-meta">
            <p className="painel-controle-greeting">Painel de Controle</p>
            <h1 className="painel-controle-username">{displayName}</h1>
          </div>
        </div>
        <div className="painel-controle-actions">
          {user ? (
            <button type="button" className="painel-controle-logout" onClick={handleLogout}>
              Sair
            </button>
          ) : (
            <Link className="painel-controle-login" to="/login">
              Entrar
            </Link>
          )}
        </div>
      </header>

      <main className="painel-controle-main">
        <section className="painel-controle-section">
          <h2>Centralize suas atividades</h2>
          <p>
            Utilize o painel de controle para visualizar atalhos rápidos, acompanhar o andamento das suas redações e descobrir
            novos recursos da plataforma.
          </p>
        </section>

        <section className="painel-controle-grid">
          <Link className="painel-controle-card painel-controle-card--primary" to="/redacao/nova">
            <h3>Criar nova redação</h3>
            <p>Inicie um novo texto, organize suas ideias e envie para correção personalizada.</p>
          </Link>
          <Link className="painel-controle-card" to="/redacao/lista">
            <h3>Minhas redações</h3>
            <p>Acompanhe o progresso, visualize comentários e baixe os relatórios mais recentes.</p>
          </Link>
          <Link className="painel-controle-card" to="/dashboard">
            <h3>Voltar ao dashboard</h3>
            <p>Retorne ao painel principal para encontrar sugestões e novidades da plataforma.</p>
          </Link>
        </section>

        <section className="painel-controle-section painel-controle-section--secondary">
          <h2>Próximos passos</h2>
          <ul>
            <li>Revise os critérios de avaliação do ENEM e UERJ para otimizar seus resultados.</li>
            <li>Defina lembretes semanais para escrever novas redações e acompanhar sua evolução.</li>
            <li>Compartilhe seus textos com professores e colegas para receber feedback colaborativo.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default PainelControlePage;
