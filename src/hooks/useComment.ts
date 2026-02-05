import { useContext } from "react";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/react";

export const useComment = (id: string) => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.getComment(id);
  return useModelState(model);
};
