export const getCookie = (name) => {
  const matches = `; ${document.cookie}`.match(`;\\s*${name}=([^;]+)`);
  return matches ? matches[1] : null;
};

export const setCookie = (name, value, days) => {
  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  document.cookie = `${name}=${value}${expires}; path=/`;
};

export const eraseCookie = (name) => {
  setCookie(name, '', -1);
};
