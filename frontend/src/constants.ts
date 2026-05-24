export const API_URL =
  "https://upgraded-waffle-5gxj55r6rv6534vpp-4000.app.github.dev";

export const SOCKET_URL =
  "https://upgraded-waffle-5gxj55r6rv6534vpp-4000.app.github.dev";

export const API_ROUTES = {
  auth: {
    register:          `${API_URL}/auth/register`,
    login:             `${API_URL}/auth/login`,
    me:                `${API_URL}/auth/me`,
    roleAvailability:  `${API_URL}/auth/role-availability`,
  },
} as const;