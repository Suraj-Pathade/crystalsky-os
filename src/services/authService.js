/**
 * Strict Security Authentication Service for CrystalSky OS
 * Owner: Pravin Ghukshe
 * Authorized Username/Email: pravinghukshephotography@gmail.com (or pravinghukshe)
 * Authorized Password: Pravin@1994#
 */

const ADMIN_EMAIL = 'pravinghukshephotography@gmail.com';
const ADMIN_USERNAME = 'pravinghukshe';
const ADMIN_PASSWORD = 'Pravin@1994#';
const AUTH_KEY = 'crystalsky_auth_session_v2';

export const AuthService = {
  getAdminEmail() {
    return ADMIN_EMAIL;
  },

  getCurrentSession() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.isLoggedIn) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Auth session error:', e);
    }
    // Default: Locked state until user signs in with Pravin@1994#
    return {
      isLoggedIn: false,
      user: null
    };
  },

  login(identifier, password) {
    const cleanId = String(identifier || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const isMatchId = cleanId === ADMIN_EMAIL.toLowerCase() || cleanId === ADMIN_USERNAME.toLowerCase();
    const isMatchPass = cleanPass === ADMIN_PASSWORD;

    if (isMatchId && isMatchPass) {
      const session = {
        isLoggedIn: true,
        user: {
          email: ADMIN_EMAIL,
          name: 'Pravin Ghukshe',
          role: 'ADMIN',
          loginTime: new Date().toISOString()
        }
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    return {
      success: false,
      error: 'Incorrect Username/Email or Password! Please enter valid Pravin Ghukshe credentials.'
    };
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
    return { isLoggedIn: false, user: null };
  }
};
