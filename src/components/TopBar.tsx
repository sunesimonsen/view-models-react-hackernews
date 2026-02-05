import { memo } from "react";
import { HomeLink } from "./HomeLink";
import { ReloadButton } from "./ReloadButton";
import { useRouteName } from "@nano-router/react";

export const TopBar = memo(() => {
  const route = useRouteName();

  return (
    <header>
      <HomeLink />
      {route === "home" && <ReloadButton />}
    </header>
  );
});

TopBar.displayName = "TopBar";
