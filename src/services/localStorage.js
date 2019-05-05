export const store = (key, val) => {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem(key, val);
  }
};

export const get = (key) => {
  if (typeof Storage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const remove = (key) => {
  if (typeof Storage !== 'undefined') {
    localStorage.removeItem(key);
  }
};
