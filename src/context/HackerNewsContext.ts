import { createContext } from "react";
import { HackerNewsModel } from "../state/HackerNewsModel";
import { HackerNewsApi } from "../api/HackerNewsApi";

export const HackerNewsContext = createContext(
  new HackerNewsModel(new HackerNewsApi()),
);
