import { API_ROUTE_BASE } from "./variables";

export const apiFetch = async ({
  route,
  method = "GET",
  headers = {
    "Content-Type": "application/json",
  },
  body,
}) => {
  try {
    const response = await fetch(`${API_ROUTE_BASE}${route}`, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (e) {
    console.log(e);
    return null;
  }
};
