import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { CommentAndAnswers } from "./CommentAndAnswers";
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

describe("CommentAndAnswers", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderCommentAndAnswers = (id: string) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <CommentAndAnswers id={id} />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  it("renders the comment", async () => {
    const comment = createComment({ id: "123", text: "Main comment text" });
    vi.mocked(api.fetchComment).mockResolvedValue(comment);
    model = new HackerNewsModel(api);

    renderCommentAndAnswers("123");

    await waitFor(() => {
      expect(screen.getByText("Main comment text")).toBeInTheDocument();
    });
  });

  it("renders the answers section", async () => {
    const comment = createComment({ id: "parent", answers: ["a1"] });
    const answer = createComment({ id: "a1", text: "Answer text" });

    vi.mocked(api.fetchComment).mockImplementation((id) => {
      if (id === "parent") return Promise.resolve(comment);
      if (id === "a1") return Promise.resolve(answer);
      return Promise.reject(new Error("Unknown"));
    });
    model = new HackerNewsModel(api);

    renderCommentAndAnswers("parent");

    await waitFor(() => {
      expect(screen.getByText("Answer text")).toBeInTheDocument();
    });
  });

  it("renders a back button", () => {
    vi.mocked(api.fetchComment).mockReturnValue(new Promise(() => {}));
    model = new HackerNewsModel(api);

    renderCommentAndAnswers("123");

    expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
  });
});
