const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '';

function decodeJwtCredential(credential) {
  if (!credential) {
    throw new Error('Credencial do Google ausente.');
  }

  const parts = credential.split('.');
  if (parts.length < 2) {
    throw new Error('Token JWT inválido.');
  }

  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  try {
    const json = atob(padded)
      .split('')
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('');
    return JSON.parse(decodeURIComponent(json));
  } catch (error) {
    throw new Error('Não foi possível decodificar a credencial do Google.');
  }
}

function ensureGoogleClient(callback) {
  if (typeof window === 'undefined' || !window.google?.accounts?.id) {
    throw new Error('Biblioteca de login do Google não carregada.');
  }

  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Defina REACT_APP_GOOGLE_CLIENT_ID para usar o login Google.');
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback,
    auto_select: false,
  });
}

export { GOOGLE_CLIENT_ID, decodeJwtCredential, ensureGoogleClient };
