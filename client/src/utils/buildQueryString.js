export const buildQueryString = (params = {}) => {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  if (filtered.length === 0) return "";
  return "?" + new URLSearchParams(Object.fromEntries(filtered)).toString();
};