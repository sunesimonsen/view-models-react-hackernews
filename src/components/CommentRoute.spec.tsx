import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { CommentRoute } from "./CommentRoute";
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

describe("CommentRoute", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderCommentRoute = (commentId: string) => {
    const history = createMemoryHistory({ initialEntries: [`/comments/${commentId}`] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <CommentRoute />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
    model = new HackerNewsModel(api);
  });

  it("renders the DefaultLayout", () => {
    vi.mocked(api.fetchComment).mockReturnValue(new Promise(() => {}));

    renderCommentRoute("123");

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("fetches the comment from the route params", async () => {
    vi.mocked(api.fetchComment).mockResolvedValue(createComment({ id: "456", text: "Route comment" }));

    renderCommentRoute("456");

    await waitFor(() => {
      expect(api.fetchComment).toHaveBeenCalledWith("456");
    });
  });

  it("renders the CommentAndAnswers component", async () => {
    vi.mocked(api.fetchComment).mockResolvedValue(createComment({ text: "The comment text" }));

    renderCommentRoute("123");

    await waitFor(() => {
      expect(screen.getByText("The comment text")).toBeInTheDocument();
    });
  });
});
