const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export const getImageUrl = (img) => {
  const url = typeof img === "string" ? img : img?.imageUrl || "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}/${url.replace(/\\/g, "/").replace(/^src\//, "")}`;
};
