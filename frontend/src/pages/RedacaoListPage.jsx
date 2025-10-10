import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RedacaoListPage.css';
import { apiRequest } from '../services/api';
import { readCurrentUser, STORAGE_KEY } from '../services/authStorage';

const formatDateTime = (value) => {
  if (!value) {
    return null;
  }

  try {
    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.warn('Falha ao formatar data de redação', error);
    return null;
  }
};

const extractIdentifier = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    return value.nome ?? value.username ?? value._id ?? value.id ?? null;
  }

  return null;
};

function RedacaoListPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());
  const [redacoes, setRedacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(readCurrentUser());
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
    if (!currentUser?.id && !currentUser?._id) {
      setRedacoes([]);
      setLoading(false);
      setError('');
      return;
    }

    let active = true;
    const alunoId = currentUser._id ?? currentUser.id;

    const fetchRedacoes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiRequest('/redacoes');
        if (!active) {
          return;
        }

        const lista = Array.isArray(response) ? response : [];
        const filtradas = lista.filter((item) => {
          const alunoValue = item.aluno;
          if (!alunoValue) {
            return false;
          }

          if (typeof alunoValue === 'string') {
            return alunoValue === alunoId;
          }

          if (typeof alunoValue === 'object') {
            return alunoValue._id === alunoId || alunoValue.id === alunoId;
          }

          return false;
        });

        setRedacoes(filtradas);
      } catch (requestError) {
        console.error('Falha ao carregar redações', requestError);
        if (active) {
          setError('Não foi possível carregar suas redações. Tente novamente em instantes.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRedacoes();

    return () => {
      active = false;
    };
  }, [currentUser?._id, currentUser?.id]);

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  const sortedRedacoes = useMemo(() => {
    return [...redacoes].sort((a, b) => {
      const getDate = (entry) => {
        const primary = entry.timestamp ?? entry.updatedAt ?? entry.createdAt ?? entry?.data?.savedAt;
        return primary ? new Date(primary).getTime() : 0;
      };

      return getDate(b) - getDate(a);
    });
  }, [redacoes]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="redacao-list-page">
      <header className="redacao-list-header">
        <div>
          <Link to="/dashboard" className="redacao-list-back">
            ← Voltar para o dashboard
          </Link>
          <p className="redacao-list-greeting">Olá, {currentUser.nome ?? currentUser.username ?? 'aluno'}</p>
          <h1>Minhas Redações</h1>
          <p className="redacao-list-subtitle">
            Consulte o histórico de redações enviadas, verifique o status e continue a edição quando necessário.
          </p>
        </div>
        <Link to="/redacao/nova" className="redacao-list-primary">
          Nova Redação
        </Link>
      </header>

      <main className="redacao-list-main">
        <section aria-live="polite">
          {loading && <p className="redacao-list-feedback">Carregando suas redações…</p>}
          {!loading && error && (
            <p className="redacao-list-feedback redacao-list-feedback--error" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && sortedRedacoes.length === 0 && (
            <div className="redacao-list-empty">
              <h2>Nenhuma redação encontrada</h2>
              <p>
                Você ainda não enviou nenhuma redação. Clique em <strong>Nova Redação</strong> para começar agora mesmo.
              </p>
            </div>
          )}

          <ul className="redacao-list-grid">
            {sortedRedacoes.map((redacao) => {
              const key = redacao._id ?? redacao.id;
              const titulo = redacao.titulo ?? 'Redação sem título';
              const status = redacao.status ?? 'Sem status';
              const turma = redacao.turma ?? '—';
              const professor = extractIdentifier(redacao.professor);
              const savedAt =
                formatDateTime(redacao.timestamp) ??
                formatDateTime(redacao.updatedAt) ??
                formatDateTime(redacao.createdAt) ??
                formatDateTime(redacao?.data?.savedAt);

              const viewLink = key ? `/redacao/exibir/${encodeURIComponent(key)}` : null;
              const editLink = key ? `/redacao/editar/${encodeURIComponent(key)}` : '/redacao/nova';
              const HeaderComponent = viewLink ? Link : 'div';
              const headerProps = viewLink ? { to: viewLink, 'aria-label': `Abrir redação "${titulo}" em modo leitura` } : {};

              return (
                <li key={key} className="redacao-list-card">
                  <HeaderComponent className="redacao-list-card__header" {...headerProps}>
                    <h3>{titulo}</h3>
                    <span className="redacao-list-status">{status}</span>
                  </HeaderComponent>
                  <dl className="redacao-list-card__meta">
                    <div>
                      <dt>Turma</dt>
                      <dd>{turma}</dd>
                    </div>
                    <div>
                      <dt>Professor(a)</dt>
                      <dd>{professor ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Atualizada em</dt>
                      <dd>{savedAt ?? '—'}</dd>
                    </div>
                  </dl>
                  <div className="redacao-list-card__actions">
                    <Link to={editLink} className="redacao-list-secondary">
                      Continuar edição
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default RedacaoListPage;
