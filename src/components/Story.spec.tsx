import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { Story } from "./Story";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Story as StoryType } from "../types/Story";
import { routes } from "./routes";

// Mock scrollIntoView and scrollBy for jsdom
Element.prototype.scrollIntoView = vi.fn();
document.documentElement.scrollBy = vi.fn();

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

const createStory = (overrides: Partial<StoryType> = {}): StoryType => ({
  id: "123",
  title: "Test Story Title",
  score: 100,
  by: "testuser",
  time: Date.now() / 1000,
  url: "https://example.com/story",
  descendants: 10,
  comments: ["456", "789"],
  ...overrides,
});

describe("Story", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderStory = (id: string, routePath = "/") => {
    const history = createMemoryHistory({ initialEntries: [routePath] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <Story id={id} />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  describe("loading state", () => {
    it("renders a placeholder while the story is loading", () => {
      vi.mocked(api.fetchStory).mockReturnValue(new Promise(() => {}));
      model = new HackerNewsModel(api);

      renderStory("123");

      expect(screen.getByRole("listitem")).toBeInTheDocument();
      expect(screen.queryByText("Test Story Title")).not.toBeInTheDocument();
    });
  });

  describe("loaded state", () => {
    it("renders the story title as a link", async () => {
      const story = createStory({ title: "Amazing Article" });
      vi.mocked(api.fetchStory).mockResolvedValue(story);
      model = new HackerNewsModel(api);

      renderStory("123");

      await waitFor(() => {
        expect(screen.getByText("Amazing Article")).toBeInTheDocument();
      });

      const link = screen.getByRole("link", { name: "Amazing Article" });
      expect(link).toHaveAttribute("href", story.url);
    });

    it("renders the story byline with score and author", async () => {
      const story = createStory({ score: 42, by: "johndoe" });
      vi.mocked(api.fetchStory).mockResolvedValue(story);
      model = new HackerNewsModel(api);

      renderStory("123");

      await waitFor(() => {
        expect(screen.getByText(/42 points by johndoe/)).toBeInTheDocument();
      });
    });

    it("shows the comments link when not expanded", async () => {
      const story = createStory({ descendants: 15 });
      vi.mocked(api.fetchStory).mockResolvedValue(story);
      model = new HackerNewsModel(api);

      renderStory("123");

      await waitFor(() => {
        expect(screen.getByText("15 comments")).toBeInTheDocument();
      });
    });
  });

  describe("expanded state", () => {
    it("renders comments when the story is expanded", async () => {
      const story = createStory({ id: "story123", comments: ["comment1"] });
      vi.mocked(api.fetchStory).mockResolvedValue(story);
      vi.mocked(api.fetchComment).mockReturnValue(new Promise(() => {}));
      model = new HackerNewsModel(api);

      renderStory("story123", "/stories/story123");

      await waitFor(() => {
        expect(screen.getByText("Test Story Title")).toBeInTheDocument();
      });

      expect(api.fetchComment).toHaveBeenCalledWith("comment1");
    });

    it("hides the comments link when expanded", async () => {
      const story = createStory({ id: "story456", descendants: 15 });
      vi.mocked(api.fetchStory).mockResolvedValue(story);
      model = new HackerNewsModel(api);

      renderStory("story456", "/stories/story456");

      await waitFor(() => {
        expect(screen.getByText("Test Story Title")).toBeInTheDocument();
      });

      expect(screen.queryByText("15 comments")).not.toBeInTheDocument();
    });
  });
});
