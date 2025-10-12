export const select = (s, root = document) => root.querySelector(s);
export const selectAll = (s, root = document) => Array.from(root.querySelectorAll(s));
export const numberFR = new Intl.NumberFormat("fr-FR");
export function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
export function toLowerNoAccent(s = ""){ return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase(); }
