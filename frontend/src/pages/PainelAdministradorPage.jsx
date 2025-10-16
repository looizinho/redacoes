import RoleDashboardLayout from './RoleDashboardLayout';

function PainelAdministradorPage() {
  return (
    <RoleDashboardLayout
      role="Administrador"
      headline="Administre a plataforma com visão estratégica"
      description="Centralize cadastros de usuários, configure turmas e mantenha a governança de dados alinhada com as necessidades pedagógicas."
      context="O administrador tem acesso global à coleção de usuários, turmas e redações. Prepare a base para que coordenadores, professores e alunos encontrem um ambiente organizado desde o primeiro acesso."
      quickActions={[
        {
          title: 'Cadastrar coordenadores',
          description: 'Crie contas de coordenação e defina credenciais temporárias para que a equipe acadêmica configure seus fluxos.',
          meta: 'Fluxo essencial',
        },
        {
          title: 'Cadastrar professores',
          description: 'Adicione professores tipo 1 e tipo 2, vinculando a especialidade e a disponibilidade de correção.',
        },
        {
          title: 'Cadastrar alunos',
          description: 'Importe novos estudantes ou cadastre manualmente, mantendo dados de contato e turma padrão atualizados.',
        },
        {
          title: 'Criar turmas',
          description: 'Estruture turmas por escola, período ou eixo temático para facilitar a distribuição de correções.',
        },
      ]}
      sections={[
        {
          title: 'Fluxo recomendado de implantação',
          description: 'Siga esta sequência ao lançar uma nova unidade ou escola na plataforma.',
          items: [
            {
              title: '1. Configure as turmas',
              description: 'Defina nome, período letivo e critérios de agrupamento antes de matricular alunos.',
            },
            {
              title: '2. Cadastre coordenadores',
              description: 'Delegue a gestão diária de turmas e matrículas para equipes locais.',
            },
            {
              title: '3. Cadastre professores',
              description: 'Registre os docentes e sinalize o tipo (1 ou 2) para controlar a carga de correções.',
            },
            {
              title: '4. Importe alunos',
              description: 'Utilize planilhas padronizadas ou cadastros individuais garantindo CPF, e-mail e turma inicial.',
            },
          ],
        },
        {
          title: 'Indicadores que merecem atenção',
          description: 'Monitore estes pontos semanalmente para antecipar gargalos operacionais.',
          items: [
            {
              title: 'Usuários pendentes de ativação',
              description: 'Verifique contas sem primeiro acesso para disparar lembretes ou resetar credenciais.',
              detail: 'Relatório em Administração > Usuários',
            },
            {
              title: 'Turmas sem professor designado',
              description: 'Nenhuma turma deve permanecer sem um professor responsável pelas correções.',
              detail: 'Use o painel do coordenador',
            },
            {
              title: 'Fila de redações sem correção',
              description: 'Garante que os professores recebam suporte quando a fila exceder o SLA combinado.',
              detail: '< 48h',
            },
          ],
          footer: 'Registre decisões críticas na coleção "post" para que professores e coordenadores recebam comunicados oficiais.',
        },
        {
          title: 'Boas práticas de governança',
          items: [
            {
              title: 'Separe ambientes de teste e produção',
              description: 'Utilize turmas fictícias para validar novas rotinas sem impactar usuários reais.',
            },
            {
              title: 'Padronize nomenclaturas',
              description: 'Adote convenções para nomes de turmas e usuários, facilitando integrações e relatórios.',
            },
            {
              title: 'Revise permissões periodicamente',
              description: 'Remova acessos obsoletos de coordenadores ou professores que não atuam mais na rede.',
            },
          ],
        },
      ]}
      timeline={[
        {
          title: 'Segunda-feira: auditoria de acessos',
          description: 'Revise novas solicitações e garanta que todas as contas essenciais foram provisionadas.',
        },
        {
          title: 'Quarta-feira: integridade das turmas',
          description: 'Cruze número de alunos e professores para identificar turmas com lotação desequilibrada.',
        },
        {
          title: 'Sexta-feira: comunicação institucional',
          description: 'Publique um post com orientações gerais e indicadores da semana para toda a comunidade.',
        },
      ]}
    />
  );
}

export default PainelAdministradorPage;
