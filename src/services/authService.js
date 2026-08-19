/**
 * Security & Google Account Authentication Service for CrystalSky OS
 * Authorised Admin Email: pravinghukshephotography@gmail.com
 */

const ADMIN_EMAIL = 'pravinghukshephotography@gmail.com';
const AUTH_KEY = 'crystalsky_auth_user';

export const AuthService = {
  getAdminEmail() {
    return ADMIN_EMAIL;
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Auth storage error:', e);
    }
    // Default logged in as Pravin Ghukshe Admin
    return {
      email: ADMIN_EMAIL,
      name: 'Pravin Ghukshe',
      role: 'ADMIN',
      avatar: 'PG',
      isLoggedIn: true
    };
  },

  loginWithEmail(email, name = 'Pravin Ghukshe') {
    const cleanedEmail = String(email || '').trim().toLowerCase();
    const isAdmin = cleanedEmail === ADMIN_EMAIL.toLowerCase();

    const user = {
      email: cleanedEmail,
      name: isAdmin ? 'Pravin Ghukshe' : name || 'Guest User',
      role: isAdmin ? 'ADMIN' : 'VIEW_ONLY',
      avatar: isAdmin ? 'PG' : (name ? name.substring(0, 2).toUpperCase() : 'GU'),
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    const guestUser = {
      email: 'guest@crystalsky.com',
      name: 'Guest Visitor',
      role: 'VIEW_ONLY',
      avatar: 'GV',
      isLoggedIn: false
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  isAdmin(user) {
    if (!user) return false;
    return user.role === 'ADMIN' && String(user.email).toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }
};
