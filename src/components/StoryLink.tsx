import { memo } from "react";
import type { Story } from "../types/Story";

interface StoryLinkProps {
  story: Story;
}

export const StoryLink = memo(({ story }: StoryLinkProps) => {
  return (
    <a
      href={story.url}
      title={story.title}
      className="story-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {story.title}
    </a>
  );
});

StoryLink.displayName = "StoryLink";
