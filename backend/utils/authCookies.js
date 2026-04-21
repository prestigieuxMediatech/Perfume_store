const DEFAULT_USER_COOKIE = 'user_session';
const DEFAULT_ADMIN_COOKIE = 'admin_session';

const getCookieName = (type = 'user') =>
  type === 'admin' ? DEFAULT_ADMIN_COOKIE : DEFAULT_USER_COOKIE;

const parseCookies = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) return acc;

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

const getTokenFromRequest = (req, type = 'user') => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[getCookieName(type)] || null;
};

const getCookieOptions = () => {
  const secure =
    String(process.env.COOKIE_SECURE || '').toLowerCase() === 'true' ||
    process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAME_SITE || (secure ? 'none' : 'lax');

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const serializeCookie = (name, value, options = {}) => {
  const merged = { ...getCookieOptions(), ...options };
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (merged.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(merged.maxAge / 1000)}`);
  if (merged.path) parts.push(`Path=${merged.path}`);
  if (merged.httpOnly) parts.push('HttpOnly');
  if (merged.secure) parts.push('Secure');
  if (merged.sameSite) parts.push(`SameSite=${merged.sameSite}`);

  return parts.join('; ');
};

const setAuthCookie = (res, token, type = 'user') => {
  res.setHeader('Set-Cookie', serializeCookie(getCookieName(type), token));
};

const clearAuthCookie = (res, type = 'user') => {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(getCookieName(type), '', {
      maxAge: 0,
    })
  );
};

module.exports = {
  clearAuthCookie,
  getCookieName,
  getTokenFromRequest,
  parseCookies,
  serializeCookie,
  setAuthCookie,
};
