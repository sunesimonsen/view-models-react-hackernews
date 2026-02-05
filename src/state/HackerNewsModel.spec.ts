import { describe, it, expect, vi, beforeEach } from "vitest";
import { HackerNewsModel } from "./HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Story } from "../types/Story";
import type { Comment } from "../types/Comment";

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
  time: 1234567890,
  url: "https://example.com",
  descendants: 10,
  comments: ["456", "789"],
  ...overrides,
});

const createComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: "123",
  text: "Test comment",
  by: "testuser",
  time: 1234567890,
  parentId: "456",
  answers: ["789"],
  ...overrides,
});

describe("HackerNewsModel", () => {
  let api: IHackerNewsApi;

  beforeEach(() => {
    api = createMockApi();
  });

  describe("constructor", () => {
    it("creates a TopStoriesViewModel and starts loading the top stories", () => {
      const model = new HackerNewsModel(api);

      expect(model.topStories).toBeDefined();
      expect(api.fetchTopStoryIds).toHaveBeenCalled();
    });
  });

  describe("getStory", () => {
    it("creates a StoryViewModel for the given id", () => {
      vi.mocked(api.fetchStory).mockResolvedValue(createStory({ id: "123" }));
      const model = new HackerNewsModel(api);

      const storyVm = model.getStory("123");

      expect(storyVm).toBeDefined();
      expect(storyVm.id).toBe("123");
    });

    it("starts loading the story automatically", () => {
      vi.mocked(api.fetchStory).mockResolvedValue(createStory({ id: "123" }));
      const model = new HackerNewsModel(api);

      model.getStory("123");

      expect(api.fetchStory).toHaveBeenCalledWith("123");
    });

    it("returns the same instance for the same id", () => {
      vi.mocked(api.fetchStory).mockResolvedValue(createStory({ id: "123" }));
      const model = new HackerNewsModel(api);

      const storyVm1 = model.getStory("123");
      const storyVm2 = model.getStory("123");

      expect(storyVm1).toBe(storyVm2);
      expect(api.fetchStory).toHaveBeenCalledTimes(1);
    });

    it("creates different instances for different ids", () => {
      vi.mocked(api.fetchStory).mockImplementation((id) =>
        Promise.resolve(createStory({ id })),
      );
      const model = new HackerNewsModel(api);

      const storyVm1 = model.getStory("123");
      const storyVm2 = model.getStory("456");

      expect(storyVm1).not.toBe(storyVm2);
      expect(storyVm1.id).toBe("123");
      expect(storyVm2.id).toBe("456");
    });
  });

  describe("getComment", () => {
    it("creates a CommentViewModel for the given id", () => {
      vi.mocked(api.fetchComment).mockResolvedValue(
        createComment({ id: "123" }),
      );
      const model = new HackerNewsModel(api);

      const commentVm = model.getComment("123");

      expect(commentVm).toBeDefined();
      expect(commentVm.id).toBe("123");
    });

    it("starts loading the comment automatically", () => {
      vi.mocked(api.fetchComment).mockResolvedValue(
        createComment({ id: "123" }),
      );
      const model = new HackerNewsModel(api);

      model.getComment("123");

      expect(api.fetchComment).toHaveBeenCalledWith("123");
    });

    it("returns the same instance for the same id", () => {
      vi.mocked(api.fetchComment).mockResolvedValue(
        createComment({ id: "123" }),
      );
      const model = new HackerNewsModel(api);

      const commentVm1 = model.getComment("123");
      const commentVm2 = model.getComment("123");

      expect(commentVm1).toBe(commentVm2);
      expect(api.fetchComment).toHaveBeenCalledTimes(1);
    });

    it("creates different instances for different ids", () => {
      vi.mocked(api.fetchComment).mockImplementation((id) =>
        Promise.resolve(createComment({ id })),
      );
      const model = new HackerNewsModel(api);

      const commentVm1 = model.getComment("123");
      const commentVm2 = model.getComment("456");

      expect(commentVm1).not.toBe(commentVm2);
      expect(commentVm1.id).toBe("123");
      expect(commentVm2.id).toBe("456");
    });
  });
});
