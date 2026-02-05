import { memo } from "react";
import { useTopStories } from "../hooks/useTopStories";

export const LoadMore = memo(() => {
  const { hasMore, loadMore } = useTopStories();

  if (!hasMore) {
    return null;
  }

  return (
    <div className="load-more-container">
      <button onClick={loadMore} className="load-more-button">
        Load more
      </button>
    </div>
  );
});

LoadMore.displayName = "LoadMore";
