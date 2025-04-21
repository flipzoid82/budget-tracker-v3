// storage.js
// This module abstracts data loading/saving for flexibility.
// It starts with JSON but is designed to support SQLite or web APIs later.

import initialData from "../data/InitialData.json";

let appData = { ...initialData };

export const loadData = async () => {
  // Simulate async behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(appData);
    }, 100);
  });
};

export const saveData = async (newData) => {
  return new Promise((resolve) => {
    appData = { ...newData };
    console.log("✅ Budget data saved (mock).");
    resolve(true);
  });
};

// Optional helper for current month access
export const getCurrentMonthData = async () => {
  const data = await loadData();
  return data.months[data.currentMonth] || {};
};