import { FONT_SIZE_DEFAULT } from "./variables";

export const pxToRem = (n) => {
  if (n instanceof Array) {
    let result = "";
    n.forEach((num) => (result = `${result} ${num / FONT_SIZE_DEFAULT}rem`));
    return result;
  } else {
    return `${n / FONT_SIZE_DEFAULT}rem`;
  }
};

export function debounce(
  callback,
  execOnLeadingEdge = false,
  debounceDelay = 200
) {
  let timeout;

  return function (...args) {
    const delayed = () => {
      if (!execOnLeadingEdge) {
        callback.apply(this, args);
      }
      timeout = null;
    };

    if (timeout) {
      clearTimeout(timeout);
    } else if (execOnLeadingEdge) {
      callback.apply(this, args);
    }

    timeout = setTimeout(delayed, debounceDelay);
  };
}

export const throttle = (callback, throttleDelay = 200) => {
  let inThrottle = false;

  return function (...args) {
    if (!inThrottle) {
      callback.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), throttleDelay);
    }
  };
};

export function getScrollBarWidth() {
  const outerEl = document.createElement("div");
  outerEl.style.visibility = "hidden";
  outerEl.style.overflow = "scroll";
  document.body.appendChild(outerEl);

  const innerEl = document.createElement("div");
  outerEl.appendChild(innerEl);

  const scrollbarWidth = outerEl.offsetWidth - innerEl.offsetWidth;

  outerEl?.parentNode?.removeChild(outerEl);

  return scrollbarWidth;
}

export const getVh = () => window.innerHeight * 0.01;

export const isOverflown = (element) =>
  isVerticalOverflown(element) || isHorizontalOverflown(element);

export const isVerticalOverflown = (element) =>
  element ? element.scrollHeight > element.clientHeight : null;

export const isHorizontalOverflown = (element) =>
  element ? element.scrollWidth > element.clientWidth : null;

export const forceFocus = (element) => {
  if (element.length && !element.is(":focus")) {
    element?.get(0)?.focus({ preventScroll: true });

    if (!element.is(":focus")) {
      element.attr("tabindex", -1);
      element?.get(0)?.focus({ preventScroll: true });
    }
  }
};
