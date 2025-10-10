import { Link } from "react-router-dom";
import { useEffect, useId, useMemo, useState } from "react";
import "./HomePage.css";
import logo from "../logo.png";
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
						<p className="title-large">Plataforma de Redações</p>
						<p className="label-medium">Componentes prontos para produção</p>
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
					<Link to="/redacao" className="nav-link label-large">Minhas Redações</Link>
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
						<p className="label-large highlight">Material 3 for Web</p>
						<h1 id={heroTitleId} className="display-small">
							Crie experiências responsivas com Material Web Components
						</h1>
						<p className="body-large on-surface-variant">
							Utilize tokens dinâmicos, tipografia escalável e componentes
							acessíveis para construir produtos consistentes em todas as
							plataformas.
						</p>
						<div className="hero-actions">
							<a
								className="cta-button cta-button--filled"
								href={`#${destaquesSectionId}`}
							>
								Explorar biblioteca
							</a>
							<a
								className="cta-button cta-button--tonal"
								href={`#${guiaSectionId}`}
							>
								Ver exemplos
							</a>
							<Link className="cta-button cta-button--outline" to="/redacao">
								Ir para a Redação
							</Link>
						</div>
						<div className="hero-meta">
							<span className="caption">
								Compatível com Material Theme Builder
							</span>
							<span className="caption">Inclui suporte a Dark Mode</span>
							<span className="caption">Baseado em web components</span>
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
							Componentes em destaque
						</h2>
						<p className="body-medium on-surface-variant">
							Aplique padrões prontos para formulários, cards e navegação com o
							estilo Material 3 atualizado.
						</p>
					</div>
					<div className="card-grid">
						<article className="feature-card">
							<h3 className="title-medium">Tema dinâmico</h3>
							<p className="body-medium">
								Ajuste cores automaticamente para diferentes identidades visuais
								e níveis de contraste.
							</p>
							<button type="button">Personalizar</button>
						</article>

						<article className="feature-card">
							<h3 className="title-medium">Interações suaves</h3>
							<p className="body-medium">
								Componentes com estados visuais refinados e animações que
								comunicam hierarquia e intenção.
							</p>
							<button type="button">Ver catálogo</button>
						</article>

						<article className="feature-card">
							<h3 className="title-medium">Layout responsivo</h3>
							<p className="body-medium">
								Grade fluida e tipografia adaptável para qualquer dispositivo.
							</p>
							<button type="button">Criar layout</button>
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
							Guias essenciais
						</h2>
						<p className="body-medium on-surface-variant">
							Siga boas práticas de design e desenvolvimento para acelerar o seu
							time.
						</p>
					</div>
					<div className="guideline-list">
						<article className="guideline-item">
							<h3 className="title-medium">Tipografia adaptativa</h3>
							<p className="body-medium on-surface-variant">
								Defina escalas e pesos que mantém legibilidade em experiências
								móveis e desktop.
							</p>
							<button type="button">Ver recomendações</button>
						</article>
						<article className="guideline-item">
							<h3 className="title-medium">Elevação e superfícies</h3>
							<p className="body-medium on-surface-variant">
								Utilize camadas, sombras e bordas suaves para destacar elementos
								chave sem perder simplicidade.
							</p>
							<button type="button">Estilos de superfície</button>
						</article>
						<article className="guideline-item">
							<h3 className="title-medium">Acessibilidade</h3>
							<p className="body-medium on-surface-variant">
								Garanta contraste, navegação por teclado e suporte a leitores de
								tela em todos os fluxos.
							</p>
							<button type="button">Checklist de acessibilidade</button>
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
							Receba atualizações
						</h2>
						<p className="body-medium on-surface-variant">
							Inscreva-se e receba novidades sobre componentes, tokens e
							exemplos de uso.
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
						<button type="submit">Assinar</button>
					</form>
				</section>
			</main>

			<footer className="app-footer">
				<p className="body-medium">
					© {new Date().getFullYear()} WOOW interativa.
				</p>
				<div className="footer-links">
					<a href={`#${heroSectionId}`}>Documentação</a>
					<a href={`#${newsletterSectionId}`}>Suporte</a>
					<Link to="/redacao">Redação</Link>
					<Link to="/login">Entrar</Link>
				</div>
			</footer>
		</div>
	);
}

export default HomePage;
