import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoadMore } from "./LoadMore";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

describe("LoadMore", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderLoadMore = () => {
    return render(
      <HackerNewsContext.Provider value={model}>
        <LoadMore />
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  it("renders the button when there are more stories to load", async () => {
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => String(i + 1))
    );
    model = new HackerNewsModel(api);

    renderLoadMore();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Load more" })).toBeInTheDocument();
    });
  });

  it("does not render when there are no more stories to load", async () => {
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue(["1", "2", "3"]);
    model = new HackerNewsModel(api);

    renderLoadMore();

    await waitFor(() => {
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  it("calls loadMore when clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => String(i + 1))
    );
    model = new HackerNewsModel(api);
    const loadMoreSpy = vi.spyOn(model.topStories, "loadMore");

    renderLoadMore();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Load more" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Load more" }));

    expect(loadMoreSpy).toHaveBeenCalled();
  });
});
