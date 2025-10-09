const STORAGE_KEY = 'md3:user';

function notifyChange() {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('md3-auth-change'));
  }
}

function persistUser(user, { passwordFallback, usernameFallback } = {}) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const normalizedUsername = (
      user?.nome ??
      user?.username ??
      usernameFallback ??
      ''
    ).toLowerCase();

    const payload = {
      ...user,
      passwordFallback,
      normalizedUsername,
      avatarUrl: user?.avatarUrl ?? user?.credenciais?.picture ?? null,
      storedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    notifyChange();
  } catch (error) {
    console.warn('Não foi possível persistir usuário localmente', error);
  }
}

function loadStoredUser(normalizedUsername) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const data = JSON.parse(raw);
    if (normalizedUsername && data.normalizedUsername !== normalizedUsername) {
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Não foi possível recuperar usuário em cache', error);
    return null;
  }
}

function readCurrentUser() {
  return loadStoredUser();
}

function clearStoredUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyChange();
  } catch (error) {
    console.warn('Não foi possível remover usuário em cache', error);
  }
}

export { STORAGE_KEY, persistUser, loadStoredUser, readCurrentUser, clearStoredUser };
