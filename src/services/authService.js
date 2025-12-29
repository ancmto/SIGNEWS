export const authService = {
  login: (data) => {
    localStorage.setItem('sgi_auth_token', 'fake-jwt-token');
    localStorage.setItem('sgi_user', JSON.stringify(data));
  },
  logout: () => localStorage.clear(),
  isAuthenticated: () => !!localStorage.getItem('sgi_auth_token')
};
