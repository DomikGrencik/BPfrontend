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
          prop.forEach((p) =>
            localStorage.setItem(key, JSON.stringify({ ...object, [p]: value }))
          );
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

  try {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(object));
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return [getItem, setItem];
};
