import { memo } from "react";
import { useLink } from "@nano-router/react";
import logo from "../images/y18.gif";

export const HomeLink = memo(() => {
  const linkProps = useLink({ route: "home" });

  return (
    <a className="home-link" {...linkProps}>
      <img src={logo} className="home-link-logo" alt="Hacker News logo" />
      <span className="home-link-brand">Hacker News</span>
    </a>
  );
});

HomeLink.displayName = "HomeLink";
