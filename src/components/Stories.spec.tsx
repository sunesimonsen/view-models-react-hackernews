import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { Stories } from "./Stories";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Story } from "../types/Story";
import { routes } from "./routes";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

const createStory = (overrides: Partial<Story> = {}): Story => ({
  id: "123",
  title: "Test Story",
  score: 100,
  by: "testuser",
  time: Date.now() / 1000,
  url: "https://example.com",
  descendants: 10,
  comments: [],
  ...overrides,
});

describe("Stories", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderStories = () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <Stories />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  it("renders an ordered list", async () => {
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue([]);
    model = new HackerNewsModel(api);

    renderStories();

    expect(screen.getByRole("list")).toBeInTheDocument();

    await waitFor(() => {
      expect(api.fetchTopStoryIds).toHaveBeenCalled();
    });
  });

  it("renders a Story component for each story id", async () => {
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue(["1", "2", "3"]);
    vi.mocked(api.fetchStory).mockImplementation((id) =>
      Promise.resolve(createStory({ id, title: `Story ${id}` }))
    );
    model = new HackerNewsModel(api);

    renderStories();

    await waitFor(() => {
      expect(screen.getByText("Story 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Story 2")).toBeInTheDocument();
    expect(screen.getByText("Story 3")).toBeInTheDocument();
  });

  it("renders the LoadMore button when there are more stories", async () => {
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => String(i + 1))
    );
    vi.mocked(api.fetchStory).mockImplementation((id) =>
      Promise.resolve(createStory({ id }))
    );
    model = new HackerNewsModel(api);

    renderStories();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Load more" })).toBeInTheDocument();
    });
  });
});
