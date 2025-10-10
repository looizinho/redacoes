import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './RedacaoDisplayPage.css';
import { apiRequest } from '../services/api';
import { readCurrentUser, STORAGE_KEY } from '../services/authStorage';

const DEFAULT_PROFESSOR_ID = '68e8b75f0ccde9fbb554f234';

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
    return value === DEFAULT_PROFESSOR_ID ? null : value;
  }

  if (typeof value === 'object') {
    const label = value.nome ?? value.username ?? value._id ?? value.id ?? null;
    return label === DEFAULT_PROFESSOR_ID ? null : label;
  }

  return null;
};

const resolveListItemContent = (item) => {
  if (item == null) {
    return '';
  }

  if (typeof item === 'string' || typeof item === 'number') {
    return String(item);
  }

  if (typeof item === 'object') {
    const { content, text, value } = item;

    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((entry) => resolveListItemContent(entry)).join('');
    }

    if (content && typeof content === 'object') {
      return resolveListItemContent(content);
    }

    if (typeof text === 'string') {
      return text;
    }

    if (typeof value === 'string') {
      return value;
    }
  }

  return '';
};

const parseErrorMessage = (error) => {
  if (!error) {
    return 'Ocorreu um erro ao carregar a redação.';
  }

  const raw = error?.message ?? String(error);

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error) {
      return parsed.error;
    }
  } catch {
    // ignore parse errors
  }

  if (raw.includes('404')) {
    return 'Redação não encontrada.';
  }

  return raw || 'Ocorreu um erro ao carregar a redação.';
};

const renderBlock = (block) => {
  if (!block) {
    return null;
  }

  const { type, data, id } = block;

  switch (type) {
    case 'paragraph': {
      const html = data?.text ?? '';
      return (
        <p key={id} className="redacao-display-block redacao-display-block--paragraph" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    case 'header': {
      const level = Math.min(Math.max(data?.level ?? 2, 1), 6);
      const Tag = `h${level}`;
      return (
        <Tag key={id} className="redacao-display-block redacao-display-block--header" dangerouslySetInnerHTML={{ __html: data?.text ?? '' }} />
      );
    }
    case 'list': {
      const items = Array.isArray(data?.items) ? data.items : [];
      const ListTag = data?.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={id} className="redacao-display-block redacao-display-block--list">
          {items.map((item, index) => (
            <li key={`${id}-${index}`} dangerouslySetInnerHTML={{ __html: resolveListItemContent(item) }} />
          ))}
        </ListTag>
      );
    }
    default:
      return (
        <pre key={id} className="redacao-display-block redacao-display-block--unknown">
          {JSON.stringify(block, null, 2)}
        </pre>
      );
  }
};

function RedacaoDisplayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());
  const [redacao, setRedacao] = useState(null);
  const [loading, setLoading] = useState(true);
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
    if (!id) {
      setError('Redação não encontrada.');
      setLoading(false);
      return;
    }

    let active = true;

    const fetchRedacao = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiRequest(`/redacao/${id}`);
        if (!active) {
          return;
        }

        setRedacao(response);
      } catch (requestError) {
        console.error('Falha ao carregar redação para leitura', requestError);
        if (active) {
          setError(parseErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRedacao();

    return () => {
      active = false;
    };
  }, [id]);

  const savedAt = useMemo(() => {
    if (!redacao) {
      return null;
    }

    return (
      formatDateTime(redacao.timestamp) ??
      formatDateTime(redacao.updatedAt) ??
      formatDateTime(redacao.createdAt) ??
      formatDateTime(redacao?.data?.savedAt)
    );
  }, [redacao]);

  const blocks = useMemo(() => {
    return Array.isArray(redacao?.data?.editor?.blocks) ? redacao.data.editor.blocks : [];
  }, [redacao]);

  const professorLabel = useMemo(() => extractIdentifier(redacao?.professor) ?? '—', [redacao]);
  const turmaLabel = redacao?.turma ?? '—';
  const statusLabel = redacao?.status ?? 'Sem status';
  const titulo = redacao?.titulo ?? 'Redação sem título';

  const canEdit = Boolean(currentUser?._id) && Boolean(id);
  const editLink = `/redacao/editar/${encodeURIComponent(id ?? '')}`;

  const handleBackToList = () => {
    navigate('/redacao/lista');
  };

  return (
    <div className="redacao-display-page">
      <header className="redacao-display-header">
        <div>
          <button type="button" className="redacao-display-back" onClick={handleBackToList}>
            ← Minhas redações
          </button>
          <h1 dangerouslySetInnerHTML={{ __html: titulo }} />
          <p className="redacao-display-subtitle">
            Consulte as informações da redação. Você pode voltar à lista ou abrir o editor para realizar ajustes.
          </p>
        </div>
        {canEdit && (
          <Link to={editLink} className="redacao-display-edit">
            Editar
          </Link>
        )}
      </header>

      <main className="redacao-display-main">
        {loading && <p className="redacao-display-feedback">Carregando redação…</p>}

        {!loading && error && (
          <p className="redacao-display-feedback redacao-display-feedback--error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && redacao && (
          <article className="redacao-display-article">
            <dl className="redacao-display-meta">
              <div>
                <dt>Status</dt>
                <dd>{statusLabel}</dd>
              </div>
              <div>
                <dt>Turma</dt>
                <dd>{turmaLabel}</dd>
              </div>
              <div>
                <dt>Professor(a)</dt>
                <dd>{professorLabel}</dd>
              </div>
              <div>
                <dt>Atualizada em</dt>
                <dd>{savedAt ?? '—'}</dd>
              </div>
            </dl>

            <section className="redacao-display-content" aria-label="Conteúdo da redação">
              {blocks.length === 0 ? (
                <p className="redacao-display-empty">Nenhum conteúdo disponível para esta redação.</p>
              ) : (
                blocks.map((block) => renderBlock(block))
              )}
            </section>
          </article>
        )}
      </main>
    </div>
  );
}

export default RedacaoDisplayPage;
