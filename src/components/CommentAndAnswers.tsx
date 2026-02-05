import { memo } from "react";
import { Comment } from "./Comment";
import { Answers } from "./Answers";
import { BackButton } from "./BackButton";

type Props = {
  id: string;
};

export const CommentAndAnswers = memo(({ id }: Props) => {
  return (
    <div className="comment-and-answers-container">
      <div className="comment-and-answers-item">
        <Comment id={id} />
        <div className="comment-and-answers-answers">
          <Answers commentId={id} />
        </div>
        <BackButton />
      </div>
    </div>
  );
});

CommentAndAnswers.displayName = "CommentAndAnswers";
