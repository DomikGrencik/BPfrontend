import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import MenuAppBar from "../components/MenuAppBar";

import {
  debounce,
  pxToRem,
  isVerticalOverflown,
  getScrollBarWidth,
} from "../utils/functions";

const Layout = () => {
  const root = document.documentElement;
  const pageBody = useRef(null);

  useEffect(() => {
    const currentPageBody = pageBody.current;

    const injectScrollBarProps = () => {
      const oldScrollBarWidth =
        getComputedStyle(root).getPropertyValue("--scrollbar-width");
      const newScrollBarWidth = pxToRem(
        isVerticalOverflown(currentPageBody) ? getScrollBarWidth() : 0
      );
      if (oldScrollBarWidth !== newScrollBarWidth) {
        root.style.setProperty("--scrollbar-width", newScrollBarWidth);
      }
    };

    injectScrollBarProps();

    ["resize", "orientationchange"].forEach((event) => {
      window.addEventListener(event, debounce(injectScrollBarProps));
    });
    ["scroll"].forEach((event) => {
      currentPageBody?.addEventListener(event, injectScrollBarProps);
    });

    return () => {
      ["resize", "orientationchange"].forEach((event) => {
        window.removeEventListener(event, debounce(injectScrollBarProps));
      });
      ["scroll"].forEach((event) => {
        currentPageBody?.removeEventListener(event, injectScrollBarProps);
      });
    };
  }, [root, root.style]);

  return (
    <div className="layout">
      <MenuAppBar />
      <div ref={pageBody} className="layout__body">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
