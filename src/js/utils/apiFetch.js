import { API_ROUTE_BASE } from "./variables";

export const apiFetch = async ({
  route,
  method = "GET",
  headers = {
    "Content-Type": "application/json",
  },
  body,
  setLoading,
}) => {
  try {
    if (setLoading) {
      setLoading(true);
    }

    const response = await fetch(`${API_ROUTE_BASE}${route}`, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const result = await response.json();
      if (setLoading) {
        setLoading(false);
      }
      return result;
    } else {
      if (setLoading) {
        setLoading(false);
      }
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};
