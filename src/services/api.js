import axios from "axios";

const BASE_URL = "https://rickandmortyapi.com/api/character";

const api = axios.create({ baseURL: BASE_URL });

const MAX_RETRIES = 5;

api.interceptors.response.use(null, async (error) => {
  const config = error.config;
  if (!config || config._retryCount >= MAX_RETRIES) return Promise.reject(error);

  const status = error.response?.status;
  if (status !== 429 && status !== 500 && status !== 503) return Promise.reject(error);

  config._retryCount = (config._retryCount || 0) + 1;

  let retryAfter = error.response?.headers?.["retry-after"];
  let delay;
  
  if (retryAfter) {
    delay = Number(retryAfter) * 1000;
  } else {
    const baseDelay = 1000;
    const maxDelay = 30000;
    delay = Math.min(baseDelay * Math.pow(2, config._retryCount - 1), maxDelay);
    delay += Math.random() * 1000;
  }

  console.log(`Rate limited. Retrying in ${Math.round(delay / 1000)}s (attempt ${config._retryCount}/${MAX_RETRIES})`);
  
  await new Promise((r) => setTimeout(r, delay));
  return api(config);
});

export async function fetchCharacters({ page = 1, name = "", status = "" }, signal) {
  const params = { page };
  if (name) params.name = name;
  if (status) params.status = status;

  try {
    const { data } = await api.get("/", { params, signal });
    return data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }
    throw error;
  }
}

export async function fetchCharacterById(id, signal) {
  try {
    const { data } = await api.get(`/${id}`, { signal });
    return data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }
    throw error;
  }
}
