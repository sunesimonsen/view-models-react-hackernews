import { memo } from "react";
import type { Story } from "../types/Story";
import { LinkButton } from "./LinkButton";

interface CommentsLinkProps {
  story: Story;
}

export const CommentsLink = memo(({ story }: CommentsLinkProps) => {
  if (story.descendants <= 0) {
    return null;
  }

  return (
    <LinkButton route="story" params={{ id: story.id }}>
      {story.descendants} comments
    </LinkButton>
  );
});

CommentsLink.displayName = "CommentsLink";
