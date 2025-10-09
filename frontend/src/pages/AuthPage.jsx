import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { apiRequest } from '../services/api';
import { persistUser, loadStoredUser } from '../services/authStorage';

const initialFormState = {
  username: '',
  age: '',
  password: '',
};

function sanitizePayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const username = formData.username.trim();
    const password = formData.password.trim();
    const normalizedUsername = username.toLowerCase();

    if (!username) {
      return { ok: false, message: 'Informe um nome de usuário.' };
    }

    if (!password) {
      return { ok: false, message: 'Informe uma senha.' };
    }

    if (mode === 'register') {
      if (!formData.age) {
        return { ok: false, message: 'Informe a idade.' };
      }

      const ageValue = Number(formData.age);

      if (Number.isNaN(ageValue) || ageValue <= 0) {
        return { ok: false, message: 'Idade deve ser maior que zero.' };
      }

      return {
        ok: true,
        payload: { username, normalizedUsername, password, age: ageValue },
      };
    }

    return { ok: true, payload: { username, normalizedUsername, password } };
  };

  const handleRegister = async ({ username, normalizedUsername, password, age }) => {
    const users = await apiRequest('/users');
    const alreadyExists = users.some((user) => user?.nome?.toLowerCase() === normalizedUsername);

    if (alreadyExists) {
      setStatus({ type: 'error', message: 'Nome de usuário já cadastrado.' });
      return;
    }

    const body = sanitizePayload({
      tipo: 'aluno',
      nome: username,
      turmas: age ? [String(age)] : [],
      redacoes: [],
      credenciais: { password },
      idade: age,
    });

    const createdUser = await apiRequest('/user/new', {
      method: 'POST',
      body,
    });

    persistUser(createdUser, {
      passwordFallback: password,
      usernameFallback: username,
    });

    setStatus({
      type: 'success',
      message: 'Cadastro realizado com sucesso! Faça login para continuar.',
    });
    setMode('login');
    setFormData({ username, age: '', password: '' });
  };

  const handleLogin = async ({ username, normalizedUsername, password }) => {
    const users = await apiRequest('/users');
    const match = users.find((user) => user?.nome?.toLowerCase() === normalizedUsername);

    if (!match) {
      setStatus({ type: 'error', message: 'Usuário não encontrado.' });
      return;
    }

    const storedPassword =
      match?.credenciais?.password ?? match?.password ?? match?.senha ?? match?.passwordFallback;

    if (storedPassword && storedPassword !== password) {
      setStatus({ type: 'error', message: 'Senha incorreta.' });
      return;
    }

    if (!storedPassword) {
      const stored = loadStoredUser(normalizedUsername);
      if (stored?.passwordFallback && stored?.passwordFallback !== password) {
        setStatus({ type: 'error', message: 'Senha incorreta.' });
        return;
      }

      persistUser(match, {
        passwordFallback: password,
        usernameFallback: username,
      });
    } else {
      persistUser(match, {
        passwordFallback: storedPassword,
        usernameFallback: username,
      });
    }

    setStatus({
      type: 'success',
      message: `Login efetuado! Bem-vindo, ${match.nome ?? username}.`,
    });
    setFormData(initialFormState);

    navigate('/', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    const validation = validate();

    if (!validation.ok) {
      setStatus({ type: 'error', message: validation.message });
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'register') {
        await handleRegister(validation.payload);
        return;
      }

      await handleLogin(validation.payload);
    } catch (error) {
      console.error('Falha na comunicação com o backend', error);
      setStatus({
        type: 'error',
        message: 'Não foi possível comunicar com o servidor. Tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleModeSwitch = () => {
    setStatus({ type: 'idle', message: '' });
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setFormData(initialFormState);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">
          ← Voltar para a home
        </Link>
        <header className="auth-header">
          <h1>{mode === 'login' ? 'Entrar' : 'Cadastrar'}</h1>
          <p className="auth-subtitle">
            Utilize o usuário e a senha para acessar ou criar a sua conta.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              maxLength={64}
              required
              placeholder="Ex: maria_dev"
            />
          </label>

          <label className="auth-field">
            <span>Idade</span>
            <input
              type="number"
              name="age"
              min={1}
              value={formData.age}
              onChange={handleChange}
              placeholder="Ex: 27"
              required={mode === 'register'}
              disabled={mode === 'login'}
            />
          </label>

          <label className="auth-field">
            <span>Senha</span>
            <input
              type="password"
              name="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
              placeholder="No mínimo 6 caracteres"
            />
          </label>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        {status.message && (
          <p className={`auth-status auth-status--${status.type}`} role="alert">
            {status.message}
          </p>
        )}

        <footer className="auth-footer">
          <span>{mode === 'login' ? 'Não possui conta?' : 'Já possui conta?'}</span>
          <button type="button" className="auth-toggle" onClick={handleModeSwitch}>
            {mode === 'login' ? 'Cadastrar' : 'Entrar'}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default AuthPage;
