import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { Details } from "./Details";
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
  answers: ["789"],
  ...overrides,
});

describe("Details", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderDetails = (commentIds: string[]) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <Details commentIds={commentIds} />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  it("renders a Comment for each comment id", async () => {
    vi.mocked(api.fetchComment).mockImplementation((id) =>
      Promise.resolve(createComment({ id, text: `Comment ${id}` }))
    );
    model = new HackerNewsModel(api);

    renderDetails(["1", "2", "3"]);

    await waitFor(() => {
      expect(screen.getByText("Comment 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Comment 2")).toBeInTheDocument();
    expect(screen.getByText("Comment 3")).toBeInTheDocument();
  });

  it("passes showAnswersLink to each Comment", async () => {
    vi.mocked(api.fetchComment).mockResolvedValue(
      createComment({ answers: ["answer1", "answer2"] })
    );
    model = new HackerNewsModel(api);

    renderDetails(["1"]);

    await waitFor(() => {
      expect(screen.getByText("2 answers")).toBeInTheDocument();
    });
  });

  it("renders a back button", () => {
    vi.mocked(api.fetchComment).mockReturnValue(new Promise(() => {}));
    model = new HackerNewsModel(api);

    renderDetails(["1"]);

    expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
  });
});
