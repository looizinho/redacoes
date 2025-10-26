import RoleDashboardLayout from './RoleDashboardLayout';

function PainelProfessorPage() {
  return (
    <RoleDashboardLayout
      role="Professor"
      headline="Acompanhe correções e engaje seus alunos"
      description="Gerencie redações pendentes, publique orientações e mantenha o diálogo com coordenadores e estudantes."
      context="Cada professor recebe designações de turmas e alunos específicas. Use este painel para organizar a fila de correções, registrar feedbacks e planejar conteúdos extras através da coleção de posts."
      quickActions={[
        {
          title: 'Correções pendentes',
          description: 'Priorize redações com maior tempo em fila e registre feedback criterioso em cada competência.',
          meta: 'Meta: 48h',
        },
        {
          title: 'Enviar devolutiva personalizada',
          description: 'Utilize comentários estruturados para orientar o próximo passo do aluno.',
        },
        {
          title: 'Publicar post na turma',
          description: 'Compartilhe dicas, cronogramas e notícias diretamente na página da turma.',
        },
        {
          title: 'Consultar turmas designadas',
          description: 'Visualize lista de turmas e acompanhe métricas de engajamento.',
        },
      ]}
      sections={[
        {
          title: 'Compreenda seu perfil docente',
          items: [
            {
              title: 'Professor tipo 1',
              description: 'Responsável pelo acompanhamento geral das turmas, revisando estrutura textual, coesão e coerência.',
            },
            {
              title: 'Professor tipo 2',
              description: 'Especialista nas competências específicas do exame, aprofundando a avaliação de repertório e argumentação.',
            },
            {
              title: 'Trabalho colaborativo',
              description: 'Ambos os perfis podem atuar em conjunto, compartilhando percepções para potencializar o progresso do aluno.',
            },
          ],
        },
        {
          title: 'Rotina de correções',
          description: 'Organize sua semana para manter prazos e garantir devolutivas consistentes.',
          items: [
            {
              title: 'Planejamento diário',
              description: 'Reserve blocos de tempo fixos para corrigir redações recém-chegadas antes de aceitar novas demandas.',
            },
            {
              title: 'Feedback estruturado',
              description: 'Inclua comentários gerais, destaques positivos e pontos de melhoria alinhados às competências do ENEM.',
            },
            {
              title: 'Revisão pós-entrega',
              description: 'Acompanhe comentários adicionais dos alunos e ajuste orientações quando necessário.',
            },
          ],
        },
        {
          title: 'Conexão com coordenadores e alunos',
          items: [
            {
              title: 'Alinhamento com o coordenador',
              description: 'Informe turmas com baixa participação ou alunos que precisam de monitorias individuais.',
            },
            {
              title: 'Posts estratégicos',
              description: 'Use a coleção "post" para compartilhar roteiros de estudos, materiais complementares e anúncios de plantões.',
            },
            {
              title: 'Indicadores de engajamento',
              description: 'Observe quantidade de redações corrigidas, tempo médio de resposta e evolução dos alunos ao longo das semanas.',
              detail: 'Atualize toda sexta',
            },
          ],
        },
      ]}
      timeline={[
        {
          title: 'Antes das aulas',
          description: 'Revise o painel para identificar redações urgentes e planeje correções por turma.',
        },
        {
          title: 'Durante a semana',
          description: 'Distribua correções ao longo dos dias e registre feedback detalhado enquanto as discussões estão frescas.',
        },
        {
          title: 'Fim da semana',
          description: 'Publice um post com dicas gerais, organize relatórios e informe o coordenador sobre demandas extras.',
        },
      ]}
    />
  );
}

export default PainelProfessorPage;
