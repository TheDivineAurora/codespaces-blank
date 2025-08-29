export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const setCookie = (name, value, options = {}) => {
  if (typeof document === 'undefined') return;
  
  const {
    expires = 7, // Default 7 days
    path = '/',
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'Lax'
  } = options;

  let cookieString = `${name}=${value}; path=${path}`;
  
  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }
  
  if (secure) {
    cookieString += '; secure';
  }
  
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }
  
  document.cookie = cookieString;
};

export const deleteCookie = (name, path = '/') => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const hasAuthCookies = () => {
  return !!(getCookie('access_token') || getCookie('refresh_token'));
};

// Debug function to log all cookies (remove in production)
export const debugCookies = () => {
  if (typeof document === 'undefined') return {};
  
  const cookies = {};
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  
  console.log('Current cookies:', cookies);
  return cookies;
};
