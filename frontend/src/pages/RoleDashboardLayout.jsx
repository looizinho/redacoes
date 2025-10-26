import { Link } from 'react-router-dom';
import './RoleDashboardLayout.css';

function renderActionWrapper(action, children) {
  if (action.to) {
    return (
      <Link to={action.to} className="role-dashboard__action role-dashboard__action--link">
        {children}
      </Link>
    );
  }

  if (action.href) {
    return (
      <a
        href={action.href}
        className="role-dashboard__action role-dashboard__action--link"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return <div className="role-dashboard__action">{children}</div>;
}

function RoleDashboardLayout({
  role,
  headline,
  description,
  context,
  quickActions = [],
  sections = [],
  timeline,
}) {
  return (
    <div className="role-dashboard">
      <header className="role-dashboard__header">
        <div className="role-dashboard__title-group">
          <span className="role-dashboard__chip">{role}</span>
          <h1 className="role-dashboard__headline">{headline}</h1>
          {description ? <p className="role-dashboard__description">{description}</p> : null}
        </div>
        {context ? (
          <aside className="role-dashboard__context">
            <h2>Visão geral</h2>
            <p>{context}</p>
          </aside>
        ) : null}
      </header>

      <main className="role-dashboard__main">
        {quickActions.length > 0 ? (
          <section className="role-dashboard__section" aria-labelledby="quick-actions">
            <div className="role-dashboard__section-header">
              <h2 id="quick-actions">Ações rápidas</h2>
              <p>
                Priorize estas atividades para manter o fluxo operacional organizado e garantir que a equipe receba
                respostas ágeis.
              </p>
            </div>
            <div className="role-dashboard__actions-grid">
              {quickActions.map((action) => (
                <article key={action.title} className="role-dashboard__action-card">
                  {renderActionWrapper(
                    action,
                    <>
                      <h3>{action.title}</h3>
                      {action.description ? <p>{action.description}</p> : null}
                      {action.meta ? <span className="role-dashboard__action-meta">{action.meta}</span> : null}
                    </>,
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {sections.map((section) => (
          <section key={section.title} className="role-dashboard__section">
            <div className="role-dashboard__section-header">
              <h2>{section.title}</h2>
              {section.badge ? <span className="role-dashboard__badge">{section.badge}</span> : null}
            </div>
            {section.description ? <p className="role-dashboard__section-description">{section.description}</p> : null}
            {section.items?.length ? (
              <ul className="role-dashboard__list">
                {section.items.map((item) => (
                  <li key={item.title} className="role-dashboard__list-item">
                    <div className="role-dashboard__list-content">
                      <h3>{item.title}</h3>
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
                    {item.detail ? <span className="role-dashboard__list-detail">{item.detail}</span> : null}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.footer ? <p className="role-dashboard__section-footer">{section.footer}</p> : null}
          </section>
        ))}

        {timeline?.length ? (
          <section className="role-dashboard__section role-dashboard__section--timeline" aria-labelledby="timeline">
            <div className="role-dashboard__section-header">
              <h2 id="timeline">Rotina sugerida</h2>
              <p>Divida suas ações ao longo da semana para evitar sobrecarga e manter as entregas previsíveis.</p>
            </div>
            <ol className="role-dashboard__timeline">
              {timeline.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default RoleDashboardLayout;
