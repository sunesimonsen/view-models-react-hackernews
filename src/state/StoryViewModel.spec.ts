import { describe, it, expect, vi, beforeEach } from "vitest";
import { StoryViewModel } from "./StoryViewModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Story } from "../types/Story";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn(),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

const storyResponse = {
  id: "123",
  title: "Test Story",
  score: 100,
  by: "testuser",
  time: 1234567890,
  url: "https://example.com",
  descendants: 10,
  comments: ["456", "789"],
};

describe("StoryViewModel", () => {
  let api: IHackerNewsApi;

  beforeEach(() => {
    api = createMockApi();
  });

  describe("constructor", () => {
    it("initializes with default state", () => {
      const vm = new StoryViewModel(api, "123");

      expect(vm.state).toEqual({ loading: false, story: null, error: null });
    });

    it("stores the id", () => {
      const vm = new StoryViewModel(api, "456");

      expect(vm.id).toBe("456");
    });
  });

  describe("load", () => {
    it("fetches the story and updates state", async () => {
      const story = storyResponse;
      vi.mocked(api.fetchStory).mockResolvedValue(story);
      const vm = new StoryViewModel(api, "123");

      await vm.load();

      expect(api.fetchStory).toHaveBeenCalledWith("123");
      expect(vm.state).toEqual({ loading: false, story, error: null });
    });

    it("sets loading to true while fetching", async () => {
      let resolvePromise: (value: Story) => void;
      vi.mocked(api.fetchStory).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );
      const vm = new StoryViewModel(api, "123");

      const loadPromise = vm.load();

      expect(vm.state.loading).toBe(true);

      resolvePromise!(storyResponse);
      await loadPromise;

      expect(vm.state.loading).toBe(false);
    });

    it("does not fetch again when already loading", async () => {
      let resolvePromise: (value: Story) => void;
      vi.mocked(api.fetchStory).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );
      const vm = new StoryViewModel(api, "123");

      vm.load();
      vm.load();
      vm.load();

      expect(api.fetchStory).toHaveBeenCalledTimes(1);

      resolvePromise!(storyResponse);
    });

    it("does not fetch again when story is already loaded", async () => {
      const story = storyResponse;
      vi.mocked(api.fetchStory).mockResolvedValue(story);
      const vm = new StoryViewModel(api, "123");

      await vm.load();
      await vm.load();

      expect(api.fetchStory).toHaveBeenCalledTimes(1);
    });

    it("handles fetch errors", async () => {
      const error = new Error("Network error");
      vi.mocked(api.fetchStory).mockRejectedValue(error);
      const vm = new StoryViewModel(api, "123");

      await vm.load();

      expect(vm.state).toEqual({
        loading: false,
        story: null,
        error,
      });
    });

    it("converts non-Error throws to Error objects", async () => {
      vi.mocked(api.fetchStory).mockRejectedValue("string error");
      const vm = new StoryViewModel(api, "123");

      await vm.load();

      expect(vm.state.error).toBeInstanceOf(Error);
      expect(vm.state.error?.message).toBe("string error");
    });
  });
});
