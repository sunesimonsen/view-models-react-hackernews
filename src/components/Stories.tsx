import { memo } from "react";
import { Story } from "./Story";
import { LoadMore } from "./LoadMore";
import { useTopStories } from "../hooks/useTopStories";

export const Stories = memo(() => {
  const { shownTopStoryIds } = useTopStories();

  return (
    <div className="stories-container">
      <ol className="stories-list">
        {shownTopStoryIds.map((id) => (
          <Story key={id} id={id} />
        ))}
      </ol>
      <LoadMore />
    </div>
  );
});

Stories.displayName = "Stories";
