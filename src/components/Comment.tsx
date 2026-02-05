import { memo } from "react";
import { Skeleton } from "./Skeleton";
import { Html } from "./Html";
import { formatRelativeHours } from "../utils/time";
import { CommentAndAnswersLink } from "./CommentAndAnswersLink";
import { useComment } from "../hooks/useComment";

type Props = {
  showAnswersLink?: boolean;
  id: string;
};

export const Comment = memo(({ id, showAnswersLink }: Props) => {
  const { comment } = useComment(id);

  if (!comment) {
    return (
      <li className="comment">
        <div>
          <Skeleton />
        </div>
        <div>
          <Skeleton />
        </div>
        <div>
          <Skeleton />
        </div>
      </li>
    );
  }

  return (
    <li className="comment">
      <div>
        <Html html={comment.text} />
      </div>
      <div className="comment-byline">
        <span>by {comment.by}</span>
        <span>{formatRelativeHours(comment.time)}</span>
        {showAnswersLink && <CommentAndAnswersLink comment={comment} />}
      </div>
    </li>
  );
});

Comment.displayName = "Comment";
