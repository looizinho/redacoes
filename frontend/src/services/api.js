const fallbackBaseUrl =
  typeof window === 'undefined'
    ? process.env.BACKEND_URL
    : `${window.location.protocol}//${window.location.hostname}:4000`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? fallbackBaseUrl;

async function apiRequest(path, { method = 'GET', headers, body, ...rest } = {}) {
  const endpoint = `${API_BASE_URL}${path}`;
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };

  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return undefined;
}

export { API_BASE_URL, apiRequest };
