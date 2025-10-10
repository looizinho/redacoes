import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import {
  STORAGE_KEY,
  clearStoredUser,
  readCurrentUser,
} from '../services/authStorage';

function DashboardPage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const displayName = useMemo(() => {
    if (!user) {
      return 'Usuário';
    }

    return (
      user?.nome ??
      user?.username ??
      user?.usernameFallback ??
      user?.normalizedUsername ??
      'Usuário'
    );
  }, [user]);

  const avatarUrl = useMemo(
    () =>
      user?.avatarUrl ??
      user?.credenciais?.picture ??
      user?.picture ??
      null,
    [user]
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
    navigate('/login', { replace: true });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-user">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`Avatar de ${displayName}`}
              className="dashboard-avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="dashboard-avatar dashboard-avatar--fallback">
              {initials}
            </span>
          )}
          <div className="dashboard-user-meta">
            <p className="dashboard-greeting">Olá,</p>
            <h1 className="dashboard-username">{displayName}</h1>
          </div>
        </div>
        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Sair
        </button>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <h2>Sua jornada começa aqui</h2>
          <p>
            Escolha uma das ações abaixo para continuar utilizando a plataforma.
          </p>
        </section>

        <section className="dashboard-actions">
          <Link className="dashboard-card dashboard-card--inverted" to="/redacao/nova">
            <h3>Nova Redação</h3>
            <p>Comece uma nova redação e envie para correção.</p>
          </Link>
          <Link className="dashboard-card" to="/redacao/lista">
            <h3>Minhas Redações</h3>
            <p>Gerencie e acompanhe o status das suas redações enviadas.</p>
          </Link>
          <Link className="dashboard-card" to="/">
            <h3>Voltar para a Home</h3>
            <p>Revisite a página inicial e explore novos recursos.</p>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
