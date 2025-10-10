import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './RedacaoPage.css';
import { apiRequest } from '../services/api';
import { readCurrentUser, STORAGE_KEY } from '../services/authStorage';

const DEFAULT_PROFESSOR_ID = '68e8b75f0ccde9fbb554f234';

const extractProfessorLabel = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value === DEFAULT_PROFESSOR_ID ? '' : value;
  }

  if (typeof value === 'object') {
    const label = value.nome ?? value.username ?? value._id ?? value.id ?? '';
    return label === DEFAULT_PROFESSOR_ID ? '' : label;
  }

  return '';
};

function RedacaoPage({ mode = 'create' }) {
  const isEditMode = mode === 'edit';
  const { id: routeId } = useParams();
  const redacaoId = isEditMode ? routeId ?? null : null;
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const commentsStoreRef = useRef(new Map());
  const undoRef = useRef(null);
  const dragDropRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditMode);
  const [initialDataReady, setInitialDataReady] = useState(!isEditMode);
  const [initialEditorData, setInitialEditorData] = useState(null);
  const [metadata, setMetadata] = useState({
    titulo: '',
    turma: '',
    professor: '',
    status: 'Rascunho',
  });

  const handleMetadataChange = (event) => {
    const { name, value } = event.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const sanitizePayload = (input) =>
    Object.fromEntries(
      Object.entries(input).filter(([, value]) =>
        value !== undefined && value !== null && value !== ''
      )
    );

  const createCommentId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `comment-${Math.random().toString(36).slice(2, 11)}`;
  };

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
    if (!currentUser || isEditMode) {
      return;
    }

    setMetadata((prev) => ({
      ...prev,
      professor:
        prev.professor || (currentUser?.tipo === 'professor' ? currentUser?.nome ?? '' : prev.professor),
    }));
  }, [currentUser, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    if (!redacaoId) {
      setMessage('Redação não encontrada. Volte para a lista e selecione novamente.');
      setInitialDataReady(false);
      setLoadingExisting(false);
      return;
    }

    let active = true;

    const fetchExistingRedacao = async () => {
      setLoadingExisting(true);
      setMessage('');

      try {
        const response = await apiRequest(`/redacao/${redacaoId}`);
        if (!active) {
          return;
        }

        const commentsSnapshot = Array.isArray(response?.data?.comments)
          ? response.data.comments
          : [];

        commentsStoreRef.current = new Map(
          commentsSnapshot.map(({ target, comments }) => [target, comments ?? []])
        );

        setMetadata((prev) => ({
          ...prev,
          titulo: response?.titulo ?? prev.titulo ?? '',
          turma: response?.turma ?? prev.turma ?? '',
          professor: extractProfessorLabel(response?.professor) || prev.professor || '',
          status: response?.status ?? prev.status ?? 'Rascunho',
        }));

        setInitialEditorData(response?.data?.editor ?? null);
      } catch (error) {
        console.error('Falha ao carregar redação existente', error);
        if (active) {
          setMessage('Não foi possível carregar esta redação. Tente novamente mais tarde.');
        }
      } finally {
        if (active) {
          setInitialDataReady(true);
          setLoadingExisting(false);
        }
      }
    };

    fetchExistingRedacao();

    return () => {
      active = false;
    };
  }, [isEditMode, redacaoId]);

  useEffect(() => {
    let isMounted = true;

    const loadEditor = async () => {
      if (editorRef.current || !editorContainerRef.current) {
        return;
      }

      if (isEditMode && !initialDataReady) {
        return;
      }

      try {
        const [
          { default: EditorJS },
          { default: Paragraph },
          { default: CommentTool },
          { default: Header },
          { default: List },
          { default: Marker },
          { default: Undo },
          { default: DragDrop },
        ] =
          await Promise.all([
            import('@editorjs/editorjs'),
            import('@editorjs/paragraph'),
            import('editorjs-comment'),
            import('@editorjs/header'),
            import('@editorjs/list'),
            import('@editorjs/marker'),
            import('editorjs-undo'),
            import('editorjs-drag-drop'),
          ]);

        const ensureSafeCommentPlugin = () => {
          if (!CommentTool || CommentTool.__md3Patched) {
            return;
          }

          const escapeAttr = (value) => {
            const safeValue = value == null ? '' : String(value);
            if (typeof window !== 'undefined' && window.CSS?.escape) {
              return window.CSS.escape(safeValue);
            }
            return safeValue.replace(/"/g, '\\"');
          };

          CommentTool.prototype.renderCommentComponent = function renderCommentComponent() {
            this.hideCommentComponent();

            const commentComponent = document.createElement('div');
            const firstBlock = this.api.blocks.getBlockByIndex(0);
            const firstBlockId = firstBlock?.id;

            let containerSelector = null;
            if (firstBlockId) {
              containerSelector = `div[data-id="${escapeAttr(firstBlockId)}"]`;
            }

            const container = containerSelector ? document.querySelector(containerSelector) : null;

            if (!container) {
              console.warn('editorjs-comment: container não encontrado para renderizar os comentários.');
              return;
            }

            commentComponent.id = 'comment-container-id';
            container.appendChild(commentComponent);

            const currentBlockId = this.blockId;
            if (!currentBlockId) {
              return;
            }

            const renderPayload = {
              commentBlockId: this.commentBlockId,
              blockId: currentBlockId,
              onClose: () => this.onClose(),
              addCommentBlockData: (data) => this.addCommentBlockData(data),
              removeBlockComments: () => this.removeBlockComments(),
            };

            const response = this.renderBody(renderPayload);

            if (response === null) {
              console.warn('editorjs-comment: nenhum componente de comentário retornado.');
              return;
            }

            if (response instanceof HTMLElement) {
              commentComponent.appendChild(response);
            } else {
              import('react-dom/client')
                .then(({ createRoot }) => {
                  const root = createRoot(commentComponent);
                  root.render(response);
                })
                .catch((error) => {
                  console.error('editorjs-comment: falha ao renderizar componente React', error);
                });
            }

            this.setActiveClass();
          };

          CommentTool.__md3Patched = true;
        };

        ensureSafeCommentPlugin();

        if (!editorContainerRef.current.id) {
          editorContainerRef.current.id = 'redacao-editor';
        }

        const renderCommentBody = ({
          commentBlockId,
          blockId,
          onClose,
          addCommentBlockData,
          removeBlockComments,
        }) => {
          if (!blockId) {
            return null;
          }

          let activeId = commentBlockId;
          const commentKey = (id) => `${blockId}:${id}`;
          const container = document.createElement('div');
          container.className = 'comment-popover';
          container.setAttribute('contenteditable', 'false');

          const header = document.createElement('div');
          header.className = 'comment-popover__header';

          const title = document.createElement('h3');
          title.className = 'comment-popover__title';
          title.textContent = 'Comentários';

          const badge = document.createElement('span');
          badge.className = 'comment-popover__badge';
          badge.textContent = '0';

          const closeButton = document.createElement('button');
          closeButton.type = 'button';
          closeButton.className = 'comment-popover__close';
          closeButton.setAttribute('aria-label', 'Fechar comentários');
          closeButton.textContent = '×';
          closeButton.addEventListener('click', () => {
            onClose?.();
          });

          header.appendChild(title);
          header.appendChild(badge);
          header.appendChild(closeButton);

          const list = document.createElement('ul');
          list.className = 'comment-list';

          const emptyState = document.createElement('p');
          emptyState.className = 'comment-empty';
          emptyState.textContent = 'Nenhum comentário ainda.';

          const form = document.createElement('form');
          form.className = 'comment-form';

          const textarea = document.createElement('textarea');
          textarea.rows = 3;
          textarea.placeholder = 'Escreva um comentário...';
          textarea.required = true;

          const formActions = document.createElement('div');
          formActions.className = 'comment-form__actions';

          const saveButton = document.createElement('button');
          saveButton.type = 'submit';
          saveButton.className = 'comment-form__button';
          saveButton.textContent = 'Adicionar';

          const clearButton = document.createElement('button');
          clearButton.type = 'button';
          clearButton.className = 'comment-form__button comment-form__button--secondary';
          clearButton.textContent = 'Limpar';

          const formatTimestamp = (isoDate) => {
            try {
              return new Date(isoDate).toLocaleString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
              });
            } catch (error) {
              console.warn('Falha ao formatar data de comentário', error);
              return '';
            }
          };

          const getComments = () => {
            if (!activeId) {
              return [];
            }

            return commentsStoreRef.current.get(commentKey(activeId)) ?? [];
          };

          const renderComments = () => {
            const comments = getComments();
            list.replaceChildren();

            if (comments.length === 0) {
              list.hidden = true;
              emptyState.hidden = false;
              badge.textContent = '0';
              clearButton.disabled = true;
              return;
            }

            list.hidden = false;
            emptyState.hidden = true;
            badge.textContent = String(comments.length);
            clearButton.disabled = false;

            comments.forEach((comment) => {
              const item = document.createElement('li');
              item.className = 'comment-list__item';

              const text = document.createElement('p');
              text.className = 'comment-list__text';
              text.textContent = comment.content;

              const footer = document.createElement('div');
              footer.className = 'comment-list__meta';
              footer.textContent = formatTimestamp(comment.createdAt);

              const removeButton = document.createElement('button');
              removeButton.type = 'button';
              removeButton.className = 'comment-list__remove';
              removeButton.textContent = 'Remover';
              removeButton.addEventListener('click', () => {
                if (!activeId) {
                  return;
                }

                const commentGroupId = activeId;
                const key = commentKey(commentGroupId);
                const current = commentsStoreRef.current.get(key) ?? [];
                const remaining = current.filter((entry) => entry.id !== comment.id);

                if (remaining.length > 0) {
                  commentsStoreRef.current.set(key, remaining);
                } else {
                  commentsStoreRef.current.delete(key);
                  removeBlockComments?.();
                  activeId = null;
                }

                addCommentBlockData({ id: commentGroupId, count: remaining.length });
                renderComments();

                if (remaining.length === 0) {
                  onClose?.();
                }
              });

              footer.appendChild(removeButton);
              item.appendChild(text);
              item.appendChild(footer);
              list.appendChild(item);
            });
          };

          form.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = textarea.value.trim();

            if (!value) {
              return;
            }

            if (!activeId) {
              activeId = createCommentId();
            }

            const key = commentKey(activeId);
            const comments = commentsStoreRef.current.get(key) ?? [];
            const newComment = {
              id: createCommentId(),
              content: value,
              createdAt: new Date().toISOString(),
            };

            commentsStoreRef.current.set(key, [...comments, newComment]);
            addCommentBlockData({ id: activeId, count: comments.length + 1 });
            textarea.value = '';
            renderComments();
          });

          clearButton.addEventListener('click', () => {
            if (!activeId) {
              return;
            }

            const key = commentKey(activeId);
            commentsStoreRef.current.delete(key);
            addCommentBlockData({ id: activeId, count: 0 });
            removeBlockComments?.();
            activeId = null;
            renderComments();
            textarea.focus();
          });

          formActions.appendChild(clearButton);
          formActions.appendChild(saveButton);
          form.appendChild(textarea);
          form.appendChild(formActions);

          container.appendChild(header);
          container.appendChild(list);
          container.appendChild(emptyState);
          container.appendChild(form);

          renderComments();
          setTimeout(() => textarea.focus(), 0);

          return container;
        };

        if (!isMounted || editorRef.current || !editorContainerRef.current) {
          return;
        }

        const instance = new EditorJS({
          holder: editorContainerRef.current,
          placeholder: 'Comece a escrever a sua redação...',
          autofocus: true,
          defaultBlock: 'paragraph',
          ...(initialEditorData ? { data: initialEditorData } : {}),
          tools: {
            header: {
              class: Header,
              inlineToolbar: ['link', 'comment', 'bold', 'marker'],
              config: {
                placeholder: 'Título da seção',
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: ['bold', 'italic', 'marker', 'link', 'comment'],
            },
            list: {
              class: List,
              inlineToolbar: ['marker', 'link', 'comment'],
              config: {
                defaultStyle: 'unordered',
              },
            },
            marker: {
              class: Marker,
              shortcut: 'CMD+SHIFT+H',
            },
            comment: {
              class: CommentTool,
              inlineToolbar: true,
              config: {
                editorjsId: editorContainerRef.current.id,
                markerColor: 'rgba(103, 80, 164, 0.18)',
                activeColor: '#6750a4',
                renderBody: renderCommentBody,
              },
            },
          },
          onReady: () => {
            if (isMounted) {
              setIsReady(true);
            }

            if (!undoRef.current) {
              undoRef.current = new Undo({ editor: instance });
            }

            if (!dragDropRef.current) {
              dragDropRef.current = new DragDrop(instance);
            }
          },
        });

        editorRef.current = instance;
      } catch (error) {
        console.error('Falha ao carregar o Editor.js', error);
        if (isMounted) {
          setMessage('Não foi possível carregar o editor. Recarregue a página.');
        }
      }
    };

    loadEditor();

    return () => {
      isMounted = false;

      if (editorRef.current?.destroy) {
        editorRef.current.destroy?.();
      }

      if (undoRef.current && editorContainerRef.current) {
        editorContainerRef.current.dispatchEvent(new Event('destroy'));
      }

      editorRef.current = null;
      undoRef.current = null;
      dragDropRef.current = null;
      setIsReady(false);

      if (editorContainerRef.current) {
        editorContainerRef.current.replaceChildren();
      }
    };
  }, [initialDataReady, initialEditorData, isEditMode]);

  const handleSave = async () => {
    if (!editorRef.current) {
      return;
    }

    if (!currentUser?._id) {
      setMessage('Faça login para enviar a redação.');
      return;
    }

    if (isEditMode) {
      if (!redacaoId) {
        setMessage('Redação não encontrada. Volte para a lista e selecione novamente.');
        return;
      }

      if (!initialDataReady || loadingExisting) {
        setMessage('Aguarde carregar os dados da redação antes de salvar.');
        return;
      }
    }

    setSaving(true);
    setMessage('');

    try {
      const output = await editorRef.current.save();
      const commentsSnapshot = Array.from(commentsStoreRef.current.entries()).map(
        ([target, comments]) => ({ target, comments })
      );

      const payload = sanitizePayload({
        aluno: currentUser._id,
        professor: DEFAULT_PROFESSOR_ID,
        turma: metadata.turma,
        titulo: metadata.titulo || 'Redação sem título',
        status: metadata.status || 'Rascunho',
        data: {
          editor: output,
          comments: commentsSnapshot,
          savedAt: new Date().toISOString(),
        },
      });

      const endpoint = isEditMode ? `/redacao/${redacaoId}` : '/redacao/new';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method,
        body: payload,
      });

      console.info('Redação registrada', response);

      if (isEditMode) {
        setMessage('Redação atualizada com sucesso.');

        if (response) {
          setMetadata((prev) => ({
            ...prev,
            titulo: response?.titulo ?? prev.titulo,
            turma: response?.turma ?? prev.turma,
            status: response?.status ?? prev.status,
            professor: extractProfessorLabel(response?.professor) || prev.professor,
          }));

          if (Array.isArray(response?.data?.comments)) {
            commentsStoreRef.current = new Map(
              response.data.comments.map(({ target, comments }) => [target, comments ?? []])
            );
          }
        }
      } else {
        setMessage('Redação enviada ao servidor com sucesso.');
      }
    } catch (error) {
      console.error('Falha ao salvar a redação', error);
      setMessage(isEditMode ? 'Não foi possível atualizar a redação. Tente novamente.' : 'Não foi possível enviar a redação. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="redacao-page">
      <header className="redacao-header" role="banner">
        <div className="redacao-header__copy">
          <h1>{isEditMode ? 'Editar Redação' : 'Redação'}</h1>
          <p>Escreva e organize suas ideias em um editor estruturado.</p>
        </div>
        <Link to="/dashboard" className="link-voltar">
          ← Voltar
        </Link>
      </header>

      <main className="redacao-main" role="main">
        <section className="editor-card" aria-labelledby="editor-title">
          <header className="editor-card__header">
            <div>
              <h2 id="editor-title">Editor de texto estruturado</h2>
              <p className="editor-subtitle">
                Utilize blocos para organizar parágrafos, listas e muito mais.
              </p>
              {currentUser?.nome && (
                <p className="editor-user" role="status">
                  Conectado como <strong>{currentUser.nome}</strong>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={
                !isReady ||
                saving ||
                !currentUser?._id ||
                (isEditMode && (!initialDataReady || loadingExisting))
              }
            >
              {saving ? 'Salvando...' : isEditMode ? 'Atualizar redação' : 'Enviar redação'}
            </button>
          </header>

          <div className="metadata-fields" aria-label="Informações da redação">
            <label className="metadata-field">
              <span>Título</span>
              <input
                type="text"
                name="titulo"
                value={metadata.titulo}
                onChange={handleMetadataChange}
                placeholder="Defina um título para a redação"
                maxLength={120}
              />
            </label>

            <label className="metadata-field">
              <span>Turma</span>
              <input
                type="text"
                name="turma"
                value={metadata.turma}
                onChange={handleMetadataChange}
                placeholder="Ex: 3ºC"
                maxLength={16}
              />
            </label>

            <label className="metadata-field">
              <span>Professor(a)</span>
              <input
                type="text"
                name="professor"
                value={metadata.professor}
                onChange={handleMetadataChange}
                placeholder="Responsável pela correção"
                maxLength={64}
              />
            </label>

            <label className="metadata-field">
              <span>Status</span>
              <select name="status" value={metadata.status} onChange={handleMetadataChange}>
                <option value="Rascunho">Rascunho</option>
                <option value="Enviada">Enviada</option>
                <option value="Correção">Correção</option>
                <option value="Corrigida">Corrigida</option>
              </select>
            </label>
          </div>

          {!currentUser?._id && (
            <p className="editor-alert" role="alert">
              Conecte-se para enviar a redação ao servidor.
            </p>
          )}

          <div className="editor-wrapper" data-editor-ready={isReady}>
            <div ref={editorContainerRef} className="editor-holder" />
          </div>

          {message && (
            <p className="editor-message" role="status">
              {message}
            </p>
          )}

          {!isReady && !message && <p className="editor-loading">Carregando editor…</p>}
        </section>
      </main>
    </div>
  );
}

export default RedacaoPage;
