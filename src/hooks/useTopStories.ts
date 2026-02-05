import { useContext } from "react";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/react";

export const useTopStories = () => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.topStories;
  const state = useModelState(model);
  return { ...state, reload: model.reload, loadMore: model.loadMore };
};
