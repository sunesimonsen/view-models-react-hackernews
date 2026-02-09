import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { Answers } from "./Answers";
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

describe("Answers", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderAnswers = (commentId: string) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <Answers commentId={commentId} />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  it("renders nothing when the comment has no answers", async () => {
    vi.mocked(api.fetchComment).mockResolvedValue(
      createComment({ id: "parent", answers: [] })
    );
    model = new HackerNewsModel(api);

    const { container } = renderAnswers("parent");

    await waitFor(() => {
      expect(api.fetchComment).toHaveBeenCalledWith("parent");
    });

    expect(container.querySelector("ul")).not.toBeInTheDocument();
  });

  it("renders a Comment for each answer", async () => {
    const parentComment = createComment({ id: "parent", answers: ["a1", "a2"] });
    const answer1 = createComment({ id: "a1", text: "First answer" });
    const answer2 = createComment({ id: "a2", text: "Second answer" });

    vi.mocked(api.fetchComment).mockImplementation((id) => {
      if (id === "parent") return Promise.resolve(parentComment);
      if (id === "a1") return Promise.resolve(answer1);
      if (id === "a2") return Promise.resolve(answer2);
      return Promise.reject(new Error("Unknown comment"));
    });
    model = new HackerNewsModel(api);

    renderAnswers("parent");

    await waitFor(() => {
      expect(screen.getByText("First answer")).toBeInTheDocument();
    });

    expect(screen.getByText("Second answer")).toBeInTheDocument();
  });

  it("passes showAnswersLink to each answer Comment", async () => {
    const parentComment = createComment({ id: "parent", answers: ["a1"] });
    const answer = createComment({ id: "a1", text: "Answer text", answers: ["nested"] });

    vi.mocked(api.fetchComment).mockImplementation((id) => {
      if (id === "parent") return Promise.resolve(parentComment);
      if (id === "a1") return Promise.resolve(answer);
      return Promise.reject(new Error("Unknown comment"));
    });
    model = new HackerNewsModel(api);

    renderAnswers("parent");

    await waitFor(() => {
      expect(screen.getByText("1 answers")).toBeInTheDocument();
    });
  });
});
