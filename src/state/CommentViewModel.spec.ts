import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommentViewModel } from "./CommentViewModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Comment } from "../types/Comment";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn(),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

const commentResponse = {
  id: "123",
  text: "Test comment",
  by: "testuser",
  time: 1234567890,
  parentId: "456",
  answers: ["789"],
};

describe("CommentViewModel", () => {
  let api: IHackerNewsApi;

  beforeEach(() => {
    api = createMockApi();
  });

  describe("constructor", () => {
    it("initializes with default state", () => {
      const vm = new CommentViewModel(api, "123");

      expect(vm.state).toEqual({
        loading: false,
        comment: null,
        error: null,
      });
    });

    it("stores the id", () => {
      const vm = new CommentViewModel(api, "456");

      expect(vm.id).toBe("456");
    });
  });

  describe("load", () => {
    it("fetches the comment and updates state", async () => {
      const comment = commentResponse;
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      const vm = new CommentViewModel(api, "123");

      await vm.load();

      expect(api.fetchComment).toHaveBeenCalledWith("123");
      expect(vm.state).toEqual({
        loading: false,
        comment,
        error: null,
      });
    });

    it("sets loading to true while fetching", async () => {
      let resolvePromise: (value: Comment) => void;
      vi.mocked(api.fetchComment).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );
      const vm = new CommentViewModel(api, "123");

      const loadPromise = vm.load();

      expect(vm.state.loading).toBe(true);

      resolvePromise!(commentResponse);
      await loadPromise;

      expect(vm.state.loading).toBe(false);
    });

    it("does not fetch again when already loading", async () => {
      let resolvePromise: (value: Comment) => void;
      vi.mocked(api.fetchComment).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );
      const vm = new CommentViewModel(api, "123");

      vm.load();
      vm.load();
      vm.load();

      expect(api.fetchComment).toHaveBeenCalledTimes(1);

      resolvePromise!(commentResponse);
    });

    it("does not fetch again when comment is already loaded", async () => {
      const comment = commentResponse;
      vi.mocked(api.fetchComment).mockResolvedValue(comment);
      const vm = new CommentViewModel(api, "123");

      await vm.load();
      await vm.load();

      expect(api.fetchComment).toHaveBeenCalledTimes(1);
    });

    it("handles fetch errors", async () => {
      const error = new Error("Network error");
      vi.mocked(api.fetchComment).mockRejectedValue(error);
      const vm = new CommentViewModel(api, "123");

      await vm.load();

      expect(vm.state).toEqual({
        loading: false,
        comment: null,
        error,
      });
    });

    it("converts non-Error throws to Error objects", async () => {
      vi.mocked(api.fetchComment).mockRejectedValue("string error");
      const vm = new CommentViewModel(api, "123");

      await vm.load();

      expect(vm.state.error).toBeInstanceOf(Error);
      expect(vm.state.error?.message).toBe("string error");
    });
  });
});
