import { Link } from "react-router-dom";
import { useEffect, useId, useMemo, useState } from "react";
import "./HomePage.css";
import logo from "../assets/logos/logo-v2.svg";
import { clearStoredUser, readCurrentUser, STORAGE_KEY } from "../services/authStorage";

function HomePage() {
	const heroTitleId = useId();
	const highlightsTitleId = useId();
	const guidelinesTitleId = useId();
	const newsletterTitleId = useId();
	const heroSectionId = useId();
	const destaquesSectionId = useId();
	const guiaSectionId = useId();
	const newsletterSectionId = useId();
	const [currentUser, setCurrentUser] = useState(() => readCurrentUser());

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

		window.addEventListener("md3-auth-change", syncUser);
		window.addEventListener("storage", handleStorage);

		return () => {
			window.removeEventListener("md3-auth-change", syncUser);
			window.removeEventListener("storage", handleStorage);
		};
	}, []);

	const handleLogout = () => {
		clearStoredUser();
		setCurrentUser(null);
	};

	const displayName = useMemo(
		() =>
			currentUser?.nome ??
			currentUser?.username ??
			currentUser?.usernameFallback ??
			currentUser?.normalizedUsername ??
			"Conta",
		[currentUser]
	);

	const avatarUrl = useMemo(
		() =>
			currentUser?.credenciais?.picture ??
			currentUser?.picture ??
			currentUser?.avatarUrl ??
			null,
		[currentUser]
	);

	const initials = useMemo(() => {
		if (!displayName) {
			return "??";
		}
		const parts = displayName.trim().split(/\s+/).slice(0, 2);
		if (parts.length === 0) {
			return "??";
		}
		return parts
			.map((part) => part.charAt(0).toUpperCase())
			.join("")
			.slice(0, 2);
	}, [displayName]);

	return (
		<div className="app-shell">
			<header className="top-app-bar">
				<div className="app-brand">
					<img src={logo} className="app-logo" alt="Material 3 logo" />
					<div className="brand-copy">
						<p className="title-large">Plataforma de Correção de Redações</p>
						<p className="label-medium">Sistema completo de correção e gestão de redações escolares</p>
					</div>
				</div>
				<nav className="app-nav" aria-label="Seções principais">
					{/* <a href={`#${heroSectionId}`} className="nav-link label-large">Visão geral</a> */}
					{/* <a href={`#${destaquesSectionId}`} className="nav-link label-large">Componentes</a> */}
					{/* <a href={`#${guiaSectionId}`} className="nav-link l abel-large">Guias</a> */}
					{/* <a href={`#${newsletterSectionId}`} className="nav-link label-large">Atualizações</a> */}
					{currentUser && (
						<Link to="/dashboard" className="nav-link label-large">
							Dashboard
						</Link>
					)}
					{/* <Link to="/redacao/nova" className="nav-link label-large">Minhas Redações</Link> */}
					{currentUser ? (
						<button
							type="button"
							onClick={handleLogout}
							className="nav-link nav-profile-button label-large"
						>
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt={`Foto de ${displayName}`}
									className="nav-profile-avatar"
									referrerPolicy="no-referrer"
								/>
							) : (
								<span className="nav-profile-fallback" aria-hidden="true">
									{initials}
								</span>
							)}
							<span className="nav-profile-text">
								<span className="nav-profile-name">{displayName}</span>
								<span className="nav-profile-action">Sair</span>
							</span>
						</button>
					) : (
						<Link to="/login" className="nav-link label-large">Entrar</Link>
					)}
				</nav>
			</header>

			<main className="app-main">
				<section
					id={heroSectionId}
					className="hero"
					aria-labelledby={heroTitleId}
				>
					<div className="hero-copy">
						<p className="label-large highlight">Correção de Redações ENEM e UERJ</p>
						<h1 id={heroTitleId} className="display-small">
							Gerencie e corrija redações com eficiência e tecnologia
						</h1>
						<p className="body-large on-surface-variant">
							Uma plataforma integrada para colégios, professores e alunos. Envie, corrija e acompanhe o desempenho dos estudantes de forma prática e centralizada.
						</p>
						<div className="hero-actions">
							<a
								className="cta-button cta-button--filled"
								href={`#${destaquesSectionId}`}
							>
								Ver funcionalidades
							</a>
							<a
								className="cta-button cta-button--tonal"
								href={`#${guiaSectionId}`}
							>
								Saiba mais
							</a>
							<Link className="cta-button cta-button--outline" to="/redacao/lista">
								Acessar redações
							</Link>
						</div>
						<div className="hero-meta">
							<span className="caption">
								Correção manual e com apoio de IA
							</span>
							<span className="caption">Suporte completo para professores e coordenadores</span>
							<span className="caption">Controle e histórico de desempenho dos alunos</span>
						</div>
					</div>
					<div className="hero-visual" aria-hidden="true">
						<div className="hero-gradient"></div>
						<div className="hero-card primary-preview">
							<div className="hero-card__headline">Dashboard de design</div>
							<div className="hero-card__supporting">
								Tokens dinâmicos aplicados a componentes essenciais.
							</div>
							<div className="hero-card__actions">
								<button type="button">Ver projeto</button>
							</div>
						</div>
						<div className="hero-card secondary-preview">
							<div className="hero-card__headline">Componentes interativos</div>
							<div className="hero-card__supporting">
								Botões, campos de texto e navegação em um layout responsivo.
							</div>
						</div>
					</div>
				</section>

				<section
					id={destaquesSectionId}
					className="section highlights"
					aria-labelledby={highlightsTitleId}
				>
					<div className="section-heading">
						<h2 id={highlightsTitleId} className="title-large">
							Recursos principais
						</h2>
						<p className="body-medium on-surface-variant">
							Aplique padrões prontos para formulários, cards e navegação com o
							estilo Material 3 atualizado.
						</p>
					</div>
					<div className="card-grid">
						<article className="feature-card">
							<h3 className="title-medium">Correção automatizada</h3>
							<p className="body-medium">
								Aproveite inteligência artificial para gerar correções preliminares que os professores podem revisar.
							</p>
							<button type="button">Ativar IA</button>
						</article>

						<article className="feature-card">
							<h3 className="title-medium">Gestão simplificada</h3>
							<p className="body-medium">
								Monitore prazos, turmas e status das correções em um painel intuitivo.
							</p>
							<button type="button">Abrir painel</button>
						</article>

						<article className="feature-card">
							<h3 className="title-medium">Acesso flexível</h3>
							<p className="body-medium">
								Alunos e professores podem acessar via web, dispositivos móveis e tablets.
							</p>
							<button type="button">Acessar turma</button>
						</article>
					</div>
				</section>

				<section
					id={guiaSectionId}
					className="section guidelines"
					aria-labelledby={guidelinesTitleId}
				>
					<div className="section-heading">
						<h2 id={guidelinesTitleId} className="title-large">
							Como funciona
						</h2>
						<p className="body-medium on-surface-variant">
							Siga boas práticas de design e desenvolvimento para acelerar o seu
							time.
						</p>
					</div>
					<div className="guideline-list">
						<article className="guideline-item">
							<h3 className="title-medium">Para coordenadores</h3>
							<p className="body-medium on-surface-variant">
								Cadastre turmas, defina prazos e atribua corretores de forma organizada.
							</p>
							<button type="button">Ver painel do coordenador</button>
						</article>
						<article className="guideline-item">
							<h3 className="title-medium">Para professores</h3>
							<p className="body-medium on-surface-variant">
								Corrija, revise e acompanhe o progresso dos alunos com feedback detalhado.
							</p>
							<button type="button">Ver painel do professor</button>
						</article>
						<article className="guideline-item">
							<h3 className="title-medium">Para alunos</h3>
							<p className="body-medium on-surface-variant">
								Envie suas redações digitadas ou por foto e acompanhe suas notas e comentários.
							</p>
							<button type="button">Ver painel do aluno</button>
						</article>
					</div>
				</section>

				<section
					id={newsletterSectionId}
					className="section newsletter"
					aria-labelledby={newsletterTitleId}
				>
					<div className="section-heading">
						<h2 id={newsletterTitleId} className="title-large">
							Novidades e atualizações
						</h2>
						<p className="body-medium on-surface-variant">
							Assine para receber novidades sobre o sistema, novas funcionalidades e integração com IA.
						</p>
					</div>
					<form className="newsletter-form">
						<label className="newsletter-field">
							<span>Email</span>
							<input
								type="email"
								name="email"
								placeholder="nome@empresa.com"
								required
							/>
						</label>
						<button type="submit">Inscrever</button>
					</form>
				</section>
			</main>

			<footer className="app-footer">
				<p className="body-medium">
					© {new Date().getFullYear()} WOOW interativa.
				</p>
				<div className="footer-links">
					<a href={`#${heroSectionId}`}>Termos de uso</a>
					<a href={`#${newsletterSectionId}`}>Contato</a>
					<Link to="/login">Acessar conta</Link>
				</div>
			</footer>
		</div>
	);
}

export default HomePage;
