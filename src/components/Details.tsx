import { memo } from "react";
import { BackButton } from "./BackButton";
import { Comment } from "./Comment";

type Props = {
  commentIds: string[];
};

export const Details = memo(({ commentIds }: Props) => {
  return (
    <div className="details">
      <ul className="comments-list">
        {commentIds.map((id) => (
          <Comment key={id} id={id} showAnswersLink />
        ))}
      </ul>
      <BackButton />
    </div>
  );
});

Details.displayName = "Details";
