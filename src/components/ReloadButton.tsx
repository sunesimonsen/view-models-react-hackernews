import { memo } from "react";
import { ReloadIcon } from "./icons";
import { useTopStories } from "../hooks/useTopStories";

export const ReloadButton = memo(() => {
  const { loading, reload } = useTopStories();

  const iconClassName = loading
    ? "reload-icon reload-icon-loading"
    : "reload-icon";

  return (
    <button onClick={reload} className="reload-button" title="refresh">
      <ReloadIcon className={iconClassName} />
    </button>
  );
});

ReloadButton.displayName = "ReloadButton";
