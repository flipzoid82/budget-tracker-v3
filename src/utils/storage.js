export const loadData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};

export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
