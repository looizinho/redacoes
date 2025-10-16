import RoleDashboardLayout from './RoleDashboardLayout';

function PainelCoordenadorPage() {
  return (
    <RoleDashboardLayout
      role="Coordenador"
      headline="Orquestre turmas e professores com precisão"
      description="Inscreva alunos nas turmas corretas, garanta que cada turma tenha um professor responsável e acompanhe a jornada pedagógica diariamente."
      context="O coordenador transforma as decisões do administrador em rotinas práticas. Ele movimenta matrículas, define qual professor atende cada turma ou aluno e sinaliza demandas especiais para a equipe pedagógica."
      quickActions={[
        {
          title: 'Matricular alunos em turmas',
          description: 'Inclua novos estudantes ou ajuste alocações quando houver transferência entre turmas.',
          meta: 'Atualize diariamente',
        },
        {
          title: 'Designar professor para a turma',
          description: 'Garanta que cada turma tenha um professor definido para acompanhar e corrigir as redações.',
        },
        {
          title: 'Atribuir professor a um aluno',
          description: 'Direcione mentorias individuais para estudantes com necessidades específicas.',
        },
        {
          title: 'Monitorar produção das turmas',
          description: 'Analise volume de redações enviadas, taxas de devolutiva e engajamento dos alunos.',
        },
      ]}
      sections={[
        {
          title: 'Checklist diário de operação',
          badge: 'Rotina sugerida',
          items: [
            {
              title: 'Verifique novas matrículas',
              description: 'Confirme se alunos recém-cadastrados receberam turma e professor designados.',
            },
            {
              title: 'Revise filas de correção',
              description: 'Acompanhe redações aguardando avaliação e reequilibre a distribuição entre professores.',
            },
            {
              title: 'Atualize comunicados',
              description: 'Informe professores e alunos sobre mudanças relevantes utilizando a coleção "post" da turma.',
            },
          ],
        },
        {
          title: 'Gestão de turmas',
          description: 'Mapeie necessidades específicas de cada turma e mantenha o cadastro em ordem.',
          items: [
            {
              title: 'Turmas com baixo envio',
              description: 'Identifique grupos com menos redações entregues e planeje ações de engajamento.',
              detail: '< 60% participação',
            },
            {
              title: 'Turmas sem professor titular',
              description: 'Reforce designações quando houver desligamentos ou férias da equipe docente.',
              detail: 'Resolver em 24h',
            },
            {
              title: 'Turmas de reforço',
              description: 'Crie turmas especiais para alunos que precisam de acompanhamento semanal adicional.',
            },
          ],
          footer: 'Ajuste o cadastro de turmas antes de solicitar novos professores ao administrador para evitar inconsistências.',
        },
        {
          title: 'Relacionamento com professores',
          items: [
            {
              title: 'Equilibre carga entre professores tipo 1 e tipo 2',
              description: 'Professores tipo 1 podem focar em revisão textual enquanto o tipo 2 avalia competências específicas.',
            },
            {
              title: 'Reuniões de alinhamento',
              description: 'Promova encontros quinzenais para revisar critérios de correção e compartilhar feedback dos alunos.',
            },
            {
              title: 'Planos de ação personalizados',
              description: 'Trabalhe com o professor designado ao aluno para alinhar metas e registrar intervenções.',
            },
          ],
        },
      ]}
      timeline={[
        {
          title: 'Início da semana',
          description: 'Faça um balanço das turmas, finalize matrículas pendentes e confirme professores responsáveis.',
        },
        {
          title: 'Meio da semana',
          description: 'Analise os indicadores de produção e acione professores quando houver riscos de atraso.',
        },
        {
          title: 'Final da semana',
          description: 'Compartilhe um resumo de entregas com o administrador e prepare posts motivacionais para as turmas.',
        },
      ]}
    />
  );
}

export default PainelCoordenadorPage;
