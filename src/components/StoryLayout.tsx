import { memo, forwardRef, type ReactNode } from "react";
import { Skeleton } from "./Skeleton";

interface StoryTitleProps {
  children: ReactNode;
}

export const StoryTitle = memo(({ children }: StoryTitleProps) => {
  return <div className="story-title">{children}</div>;
});

StoryTitle.displayName = "StoryTitle";

interface StoryCardProps {
  children: ReactNode;
}

export const StoryCard = memo(
  forwardRef<HTMLLIElement, StoryCardProps>(({ children }, ref) => {
    return (
      <li className="story-card" ref={ref}>
        {children}
      </li>
    );
  }),
);

StoryCard.displayName = "StoryCard";

export const StoryPlaceholder = memo(() => {
  return (
    <StoryCard>
      <StoryTitle>
        <Skeleton />
      </StoryTitle>
      <div>
        <Skeleton />
      </div>
    </StoryCard>
  );
});

StoryPlaceholder.displayName = "StoryPlaceholder";
