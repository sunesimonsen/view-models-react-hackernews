import { DefaultLayout } from "./DefaultLayout";
import { CommentAndAnswers } from "./CommentAndAnswers";
import { useParams } from "@nano-router/react";

export const CommentRoute = () => {
  const { id } = useParams();

  return (
    <DefaultLayout>
      <CommentAndAnswers id={id} />
    </DefaultLayout>
  );
};
