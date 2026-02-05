import { memo, useEffect, useRef } from "react";
import { StoryCard, StoryTitle, StoryPlaceholder } from "./StoryLayout";
import { StoryLink } from "./StoryLink";
import { StoryByline } from "./StoryByline";
import { useParams } from "@nano-router/react";
import { Details } from "./Details";
import { useStory } from "../hooks/useStory";

type Props = {
  id: string;
};

export const Story = memo(({ id }: Props) => {
  const { id: expandedId } = useParams();
  const ref = useRef<HTMLLIElement>(null);
  const { story } = useStory(id);
  const isExpanded = id === expandedId;

  useEffect(() => {
    if (story && ref.current && isExpanded) {
      ref.current.scrollIntoView(true);
      document.documentElement.scrollBy(0, -45);
    }
  }, [isExpanded, story]);

  if (!story) {
    return <StoryPlaceholder />;
  }

  return (
    <StoryCard ref={ref}>
      <StoryTitle>
        <StoryLink story={story} />
      </StoryTitle>
      <StoryByline story={story} showCommentLink={!isExpanded} />
      {isExpanded && <Details commentIds={story.comments} />}
    </StoryCard>
  );
});
