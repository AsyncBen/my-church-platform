export const API_URL =
  "https://bug-free-couscous-5g9759wv6647f4w7r-4000.app.github.dev";

export const SOCKET_URL =
  "https://bug-free-couscous-5g9759wv6647f4w7r-4000.app.github.dev";

export const API_ROUTES = {
  auth: {
    register: `${API_URL}/auth/register`,
    login:    `${API_URL}/auth/login`,
    me:       `${API_URL}/auth/me`,
  },
} as const;