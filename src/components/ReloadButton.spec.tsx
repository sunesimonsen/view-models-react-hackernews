import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReloadButton } from "./ReloadButton";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

describe("ReloadButton", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderReloadButton = () => {
    return render(
      <HackerNewsContext.Provider value={model}>
        <ReloadButton />
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
  });

  it("renders a button with refresh title", async () => {
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue([]);
    model = new HackerNewsModel(api);

    renderReloadButton();

    await waitFor(() => {
      expect(model.topStories.state.loading).toBe(false);
    });

    expect(screen.getByRole("button", { name: "refresh" })).toBeInTheDocument();
  });

  it("shows loading state when stories are loading", () => {
    vi.mocked(api.fetchTopStoryIds).mockReturnValue(new Promise(() => {}));
    model = new HackerNewsModel(api);

    renderReloadButton();

    const icon = document.querySelector(".reload-icon-loading");
    expect(icon).toBeInTheDocument();
  });

  it("removes loading state when stories finish loading", async () => {
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue([]);
    model = new HackerNewsModel(api);

    renderReloadButton();

    await waitFor(() => {
      const icon = document.querySelector(".reload-icon-loading");
      expect(icon).not.toBeInTheDocument();
    });
  });

  it("calls reload when clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTopStoryIds).mockResolvedValue([]);
    model = new HackerNewsModel(api);
    const reloadSpy = vi.spyOn(model.topStories, "reload");

    renderReloadButton();

    await waitFor(() => {
      expect(model.topStories.state.loading).toBe(false);
    });

    await user.click(screen.getByRole("button", { name: "refresh" }));

    expect(reloadSpy).toHaveBeenCalled();
  });
});
