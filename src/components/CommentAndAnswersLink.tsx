import { memo } from "react";
import type { Comment } from "../types/Comment";
import { LinkButton } from "./LinkButton";

interface CommentAndAnswersLinkProps {
  comment: Comment;
}

export const CommentAndAnswersLink = memo(
  ({ comment }: CommentAndAnswersLinkProps) => {
    if (comment.answers.length === 0) {
      return null;
    }

    return (
      <LinkButton route="comment" params={{ id: comment.id }}>
        {comment.answers.length} answers
      </LinkButton>
    );
  },
);

CommentAndAnswersLink.displayName = "CommentAndAnswersLink";
