import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import MenuAppBar from "../components/MenuAppBar";

import {
  debounce,
  pxToRem,
  getVh,
  isVerticalOverflown,
  getScrollBarWidth,
} from "../utils/functions";

const Layout = () => {
  const root = document.documentElement;
  const pageBody = useRef(null);

  useEffect(() => {
    const injectVhProps = () =>
      root.style.setProperty("--vh", pxToRem(getVh()));

    const injectScrollBarProps = () => {
      root.style.setProperty(
        "--scrollbar-width",
        pxToRem(isVerticalOverflown(pageBody.current) ? getScrollBarWidth() : 0)
      );
    };

    injectVhProps();
    injectScrollBarProps();

    window.addEventListener("resize", injectVhProps);
    window.addEventListener("resize", debounce(injectScrollBarProps));

    return () => {
      window.removeEventListener("resize", injectVhProps);
      window.removeEventListener("resize", debounce(injectScrollBarProps));
    };
  }, [root.style]);

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
