import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { RootRoute } from "./RootRoute";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Comment } from "../types/Comment";
import { routes } from "./routes";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

const createComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: "123",
  text: "Test comment",
  by: "testuser",
  time: Date.now() / 1000,
  parentId: "456",
  answers: [],
  ...overrides,
});

describe("RootRoute", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderRootRoute = (routePath: string) => {
    const history = createMemoryHistory({ initialEntries: [routePath] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <RootRoute />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
    model = new HackerNewsModel(api);
  });

  it("renders StoriesRoute on the home route", () => {
    renderRootRoute("/");

    expect(screen.getByText("Hacker News")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders StoriesRoute on the story route", () => {
    renderRootRoute("/stories/123");

    expect(screen.getByText("Hacker News")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders CommentRoute on the comment route", async () => {
    vi.mocked(api.fetchComment).mockResolvedValue(createComment({ text: "A comment" }));
    renderRootRoute("/comments/123");

    await waitFor(() => {
      expect(screen.getByText("A comment")).toBeInTheDocument();
    });
  });
});
