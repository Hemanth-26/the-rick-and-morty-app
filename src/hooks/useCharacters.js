import { useState, useEffect } from "react";
import { fetchCharacters } from "../services/api";

export function useCharacters({ page, name, status }) {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({ pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchCharacters({ page, name, status }, controller.signal)
      .then((data) => {
        setCharacters(data.results);
        setInfo(data.info);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (err.response?.status === 404) {
          setCharacters([]);
          setInfo({ pages: 1 });
        } else {
          setError("Failed to fetch characters. Please try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, name, status]);

  return { characters, info, loading, error };
}
