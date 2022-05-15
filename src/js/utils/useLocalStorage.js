import { useCallback } from "react";

export const useLocalStorage = (key, object) => {
  const getItem = useCallback(
    (prop) => {
      try {
        const object = JSON.parse(localStorage.getItem(key));
        return object[prop];
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [key]
  );

  const setItem = useCallback(
    (prop, value) => {
      try {
        const object = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(prop)) {
          prop.forEach((p) => (object[p] = value));
          localStorage.setItem(key, JSON.stringify(object));
        } else {
          localStorage.setItem(
            key,
            JSON.stringify({ ...object, [prop]: value })
          );
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [key]
  );

  const initialize = useCallback(() => {
    try {
      localStorage.setItem(key, JSON.stringify(object));
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [key, object]);

  if (!localStorage.getItem(key)) {
    initialize();
  }

  return [initialize, getItem, setItem];
};
