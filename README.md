# Plataforma de Correção de Redações

Este repositório reúne o backend Fastify e o frontend React de uma plataforma para envio, correção e acompanhamento de redações escolares. Ele está preparado para autenticação básica (incluindo login via Google), gerenciamento de usuários, cadastro de redações, visualização de feedbacks e distribuição em aplicações web e móveis via Capacitor.

## Estrutura do projeto

| Diretório | Descrição |
|-----------|-----------|
| `backend/` | API Fastify com MongoDB para cadastro de usuários e redações. |
| `frontend/` | Aplicação React + Material 3 que consome a API, com integração Capacitor. |
| `docs/` | Materiais de apoio e diagnósticos do projeto. |

## Backend (`backend/`)

### Tecnologias e dependências
- [Fastify 5](https://fastify.dev/) para a API HTTP.
- [Mongoose 8](https://mongoosejs.com/) para ODM com MongoDB.
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) para hash de senhas.
- Carrega variáveis de ambiente a partir de `.env.local` usando `dotenv`.

### Configuração
1. Acesse `backend/` e instale dependências com `pnpm install` (ou `npm install`).
2. Configure as variáveis de ambiente em um arquivo `.env.local` na raiz de `backend/`:
   ```ini
   MONGODB_URL=mongodb+srv://<usuario>:<senha>@<cluster>/<database>
   # opcionalmente use MONGODB_URI, que tem precedência se definido
   ```
3. Inicie o servidor com `pnpm start` (modo produção) ou `pnpm dev` (com recarga via `nodemon`). O serviço escuta em `http://127.0.0.1:4000` por padrão.

### Modelos de dados
- **User** (`models/User.js`)
  - Campos principais: `username`, `nome`, `age`, `tipo`, `turmas`, `redacoes`.
  - Senha armazenada em `credenciais.password`, protegida por hook `pre('save')` que gera hash com bcrypt.
- **Redacao** (`models/Redacao.js`)
  - Associações: `aluno` e `professor` referenciam `User`.
  - Metadados: `turma`, `titulo` (padrão "Nova Redação"), `status` (padrão "Não enviada"), `data` (payload livre) e `timestamp` com `Date.now`.

### Endpoints principais
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/user/new` | Cria um usuário, hash de senha antes de salvar. |
| `GET` | `/users` | Lista usuários removendo `credenciais.password` da resposta. |
| `POST` | `/redacao/new` | Cria uma redação vinculada a aluno/professor. |
| `GET` | `/redacao/:id` | Busca redação por ID. |
| `PUT` | `/redacao/:id` | Atualiza campos fornecidos e registra `timestamp`. |
| `GET` | `/redacoes` | Lista redações. |
| `GET` | `/ping` | Endpoint de verificação de saúde.

Todas as rotas aplicam CORS permissivo para facilitar o desenvolvimento local (origem dinâmica, suporte a credenciais e preflight).

## Frontend (`frontend/`)

### Tecnologias e dependências
- Aplicação React (Create React App) com React Router 7.
- UI baseada em Material 3, ícones MUI e EditorJS para edição rica das redações.
- Integração com Capacitor para empacotar apps móveis.
- Serviços auxiliares em `src/services` para requisições (`api.js`), persistência de sessão (`authStorage.js`) e login Google (`googleAuth.js`).

### Principais páginas
- **Home** (`HomePage.jsx`): landing page com destaque das funcionalidades, call-to-actions e suporte a login/logout exibindo avatar do usuário.
- **Autenticação** (`AuthPage.jsx`): formulário de login/cadastro com validações, verificação de duplicidade no backend e opção de login com Google Identity Services.
- **Dashboard** (`DashboardPage.jsx`): hub autenticado que dá acesso rápido a criar nova redação, listar existentes e voltar para a home.
- **Editor de Redação** (`RedacaoPage.jsx`): EditorJS com comentários, status e metadados; suporta criação e edição com carregamento assíncrono dos dados.
- **Lista de Redações** (`RedacaoListPage.jsx`): mostra redações do aluno autenticado, com filtros, estados de carregamento e links para continuar edição ou visualizar.
- **Leitura da Redação** (`RedacaoDisplayPage.jsx`): renderiza blocks do EditorJS em modo somente leitura, incluindo metadados (professor, turma, datas, status).
- **Painel de Controle** (`PainelControlePage.jsx`): vitrine estática com cards de administração.

### Configuração
1. Dentro de `frontend/`, instale dependências com `pnpm install`.
2. Opcionalmente configure um arquivo `.env` para sobrepor URLs padrão:
   ```bash
   REACT_APP_API_BASE_URL=http://localhost:4000
   REACT_APP_GOOGLE_CLIENT_ID=<client-id-google>
   ```
   - Sem `REACT_APP_API_BASE_URL`, o app usa automaticamente `window.location.hostname` e porta `4000`.
3. Execute `pnpm start` para desenvolvimento (CRA com ESLint). Outros comandos úteis:
   - `pnpm build` para gerar o bundle de produção (necessário antes de sincronizar com Capacitor).
   - `pnpm test` para rodar Jest/RTL.
4. Para empacotamento mobile, use `pnpm exec cap sync ios|android` após um build.

### Autenticação e estado
- Sessão armazenada em `localStorage` (chave `md3:user`) com eventos customizados para sincronização entre abas.
- Ao autenticar, os dados do usuário são buscados via API (`/users`) e persistidos com fallback de senha para ambientes sem hash.
- Login Google decodifica o JWT localmente e registra um novo usuário caso ainda não exista.

## Fluxo sugerido de desenvolvimento
1. Suba o backend com MongoDB configurado.
2. Inicie o frontend apontando para o backend local (`REACT_APP_API_BASE_URL`).
3. Faça cadastro/login pela `AuthPage` para gerar usuários e testar o fluxo completo de criação/edição/visualização de redações.
4. Execute `pnpm test` no frontend e adote `pnpm dev` no backend para iterar com recarga automática.

## Recursos adicionais
- `docs/git-diagnostico.md` registra decisões e diagnósticos anteriores do projeto.
- O backend possui script `pnpm dev` com `nodemon` para recarga em desenvolvimento.
- O frontend inclui `serviceWorkerRegistration.js` e configuração Workbox para PWA opcional.

Contribuições devem manter commits pequenos e mensagens no imperativo. Consulte `frontend/AGENTS.md` para diretrizes adicionais de desenvolvimento do cliente web.
