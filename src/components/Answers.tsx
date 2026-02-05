import { memo } from "react";
import { Comment } from "./Comment";
import { useComment } from "../hooks/useComment";

type Props = {
  commentId: string;
};

export const Answers = memo(({ commentId }: Props) => {
  const { comment } = useComment(commentId);

  if (comment?.answers.length === 0) return null;

  return (
    <ul className="comments-list">
      {comment?.answers.map((id) => (
        <Comment key={id} id={id} showAnswersLink />
      ))}
    </ul>
  );
});

Answers.displayName = "Answers";
