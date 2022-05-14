export const useLocalStorage = (key, object) => {
  try {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(object));
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  const getItem = (prop) => {
    try {
      const object = JSON.parse(localStorage.getItem(key));
      return object[prop];
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const setItem = (prop, value) => {
    try {
      const object = JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify({ ...object, [prop]: value }));
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return [getItem, setItem];
};
