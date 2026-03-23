import { useState, useEffect, useCallback } from "react";

function getParams() {
  const sp = new URLSearchParams(window.location.search);
  return {
    name: sp.get("name") || "",
    status: sp.get("status") || "",
    page: Number(sp.get("page")) || 1,
  };
}

export function useSearchParams() {
  const [params, setParams] = useState(getParams);

  useEffect(() => {
    const onPopState = () => setParams(getParams());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const updateParams = useCallback((updates) => {
    setParams((prev) => {
      const next = { ...prev, ...updates };
      const sp = new URLSearchParams();
      if (next.name) sp.set("name", next.name);
      if (next.status) sp.set("status", next.status);
      if (next.page > 1) sp.set("page", String(next.page));
      const qs = sp.toString();
      const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, "", url);
      return next;
    });
  }, []);

  return [params, updateParams];
}
