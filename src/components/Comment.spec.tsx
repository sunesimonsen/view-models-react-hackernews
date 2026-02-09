import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { Comment } from "./Comment";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Comment as CommentType } from "../types/Comment";
import { routes } from "./routes";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

const createComment = (overrides: Partial<CommentType> = {}): CommentType => ({
  id: "123",
  text: "This is a test comment",
  by: "commenter",
  time: Date.now() / 1000,
  parentId: "456",
  answers: [],
  ...overrides,
});

describe("Comment", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderComment = (id: string, showAnswersLink = false) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <Comment id={id} showAnswersLink={showAnswersLink} />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  describe("loading state", () => {
    it("renders skeleton placeholders while loading", () => {
      vi.mocked(api.fetchComment).mockReturnValue(new Promise(() => {}));
      model = new HackerNewsModel(api);

      renderComment("123");

      const skeletons = document.querySelectorAll(".skeleton");
      expect(skeletons.length).toBe(3);
    });
  });

  describe("loaded state", () => {
    it("renders the comment text", async () => {
      const comment = createComment({ text: "Great article!" });
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      model = new HackerNewsModel(api);

      renderComment("123");

      await waitFor(() => {
        expect(screen.getByText("Great article!")).toBeInTheDocument();
      });
    });

    it("renders the author name", async () => {
      const comment = createComment({ by: "johndoe" });
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      model = new HackerNewsModel(api);

      renderComment("123");

      await waitFor(() => {
        expect(screen.getByText(/by johndoe/)).toBeInTheDocument();
      });
    });

    it("renders HTML content safely", async () => {
      const comment = createComment({ text: "<p>Formatted <strong>text</strong></p>" });
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      model = new HackerNewsModel(api);

      renderComment("123");

      await waitFor(() => {
        expect(screen.getByText("text")).toBeInTheDocument();
      });
    });
  });

  describe("answers link", () => {
    it("shows the answers link when showAnswersLink is true and there are answers", async () => {
      const comment = createComment({ answers: ["789", "101"] });
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      model = new HackerNewsModel(api);

      renderComment("123", true);

      await waitFor(() => {
        expect(screen.getByText("2 answers")).toBeInTheDocument();
      });
    });

    it("hides the answers link when there are no answers", async () => {
      const comment = createComment({ answers: [] });
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      model = new HackerNewsModel(api);

      renderComment("123", true);

      await waitFor(() => {
        expect(screen.getByText("This is a test comment")).toBeInTheDocument();
      });

      expect(screen.queryByText(/answers/)).not.toBeInTheDocument();
    });

    it("hides the answers link when showAnswersLink is false", async () => {
      const comment = createComment({ answers: ["789"] });
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      model = new HackerNewsModel(api);

      renderComment("123", false);

      await waitFor(() => {
        expect(screen.getByText("This is a test comment")).toBeInTheDocument();
      });

      expect(screen.queryByText(/answers/)).not.toBeInTheDocument();
    });
  });
});
