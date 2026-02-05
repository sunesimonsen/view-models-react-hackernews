import { describe, it, expect, vi, beforeEach } from "vitest";
import { TopStoriesViewModel } from "./TopStoriesViewModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn(),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

const createStoryIds = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => String(i + 1));

describe("TopStoriesViewModel", () => {
  let api: IHackerNewsApi;

  beforeEach(() => {
    api = createMockApi();
  });

  describe("constructor", () => {
    it("initializes with default state", () => {
      const vm = new TopStoriesViewModel(api);

      expect(vm.state).toEqual({
        error: null,
        topStoryIds: [],
        shownTopStoryIds: [],
        hasMore: false,
        loading: false,
      });
    });
  });

  describe("load", () => {
    it("fetches top story ids and shows first page", async () => {
      const ids = createStoryIds(50);
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(ids);
      const vm = new TopStoriesViewModel(api);

      await vm.load();

      expect(api.fetchTopStoryIds).toHaveBeenCalled();
      expect(vm.state).toEqual({
        topStoryIds: ids,
        shownTopStoryIds: ids.slice(0, 20),
        error: null,
        loading: false,
        hasMore: true,
      });
    });

    it("sets loading to true while fetching", async () => {
      let resolvePromise: (value: string[]) => void;
      vi.mocked(api.fetchTopStoryIds).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );
      const vm = new TopStoriesViewModel(api);

      const loadPromise = vm.load();

      expect(vm.state.loading).toBe(true);

      resolvePromise!(createStoryIds(10));
      await loadPromise;

      expect(vm.state.loading).toBe(false);
    });

    it("does not fetch again when already loading", async () => {
      let resolvePromise: (value: string[]) => void;
      vi.mocked(api.fetchTopStoryIds).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );
      const vm = new TopStoriesViewModel(api);

      vm.load();
      vm.load();
      vm.load();

      expect(api.fetchTopStoryIds).toHaveBeenCalledTimes(1);

      resolvePromise!(createStoryIds(10));
    });

    it("does not fetch again when stories are already loaded", async () => {
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(createStoryIds(10));
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      await vm.load();

      expect(api.fetchTopStoryIds).toHaveBeenCalledTimes(1);
    });

    it("handles fetch errors", async () => {
      const error = new Error("Network error");
      vi.mocked(api.fetchTopStoryIds).mockRejectedValue(error);
      const vm = new TopStoriesViewModel(api);

      await vm.load();

      expect(vm.state).toEqual({
        error,
        topStoryIds: [],
        shownTopStoryIds: [],
        hasMore: false,
        loading: false,
      });
    });

    it("converts non-Error throws to Error objects", async () => {
      vi.mocked(api.fetchTopStoryIds).mockRejectedValue("string error");
      const vm = new TopStoriesViewModel(api);

      await vm.load();

      expect(vm.state.error).toBeInstanceOf(Error);
      expect(vm.state.error?.message).toBe("string error");
    });
  });

  describe("reload", () => {
    it("forces a new fetch even when stories are loaded", async () => {
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(createStoryIds(10));
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      await vm.reload();

      expect(api.fetchTopStoryIds).toHaveBeenCalledTimes(2);
    });

    it("forces a new fetch even while loading", async () => {
      let resolveCount = 0;
      vi.mocked(api.fetchTopStoryIds).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveCount++;
            resolve(createStoryIds(10));
          }),
      );
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      await vm.reload();

      expect(resolveCount).toBe(2);
    });
  });

  describe("loadMore", () => {
    it("loads the next page of stories", async () => {
      const ids = createStoryIds(50);
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(ids);
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      vm.loadMore();

      expect(vm.state.shownTopStoryIds).toEqual(ids.slice(0, 40));
      expect(vm.state.hasMore).toBe(true);
    });

    it("loads multiple pages", async () => {
      const ids = createStoryIds(50);
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(ids);
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      vm.loadMore();
      vm.loadMore();

      expect(vm.state.shownTopStoryIds).toEqual(ids);
      expect(vm.state.hasMore).toBe(false);
    });

    it("sets hasMore to false when loading more reveals no additional stories", async () => {
      const ids = createStoryIds(20);
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(ids);
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      expect(vm.state.hasMore).toBe(true);

      vm.loadMore();

      expect(vm.state.hasMore).toBe(false);
    });

    it("does nothing when hasMore is false", async () => {
      const ids = createStoryIds(20);
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(ids);
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      vm.loadMore();
      expect(vm.state.hasMore).toBe(false);
      const stateBeforeLoadMore = { ...vm.state };

      vm.loadMore();

      expect(vm.state).toEqual(stateBeforeLoadMore);
    });

    it("handles partial last page", async () => {
      const ids = createStoryIds(35);
      vi.mocked(api.fetchTopStoryIds).mockResolvedValue(ids);
      const vm = new TopStoriesViewModel(api);

      await vm.load();
      expect(vm.state.shownTopStoryIds).toHaveLength(20);
      expect(vm.state.hasMore).toBe(true);

      vm.loadMore();
      expect(vm.state.shownTopStoryIds).toEqual(ids);
      expect(vm.state.hasMore).toBe(false);
    });
  });
});
