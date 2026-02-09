import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { StoryByline } from "./StoryByline";
import type { Story } from "../types/Story";
import { routes } from "./routes";

vi.mock("../utils/time", () => ({
  formatRelativeHours: vi.fn().mockReturnValue("2 hours ago"),
}));

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

describe("StoryByline", () => {
  const renderStoryByline = (story: Story, showCommentLink: boolean) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <Router history={history} routes={routes}>
        <StoryByline story={story} showCommentLink={showCommentLink} />
      </Router>
    );
  };

  it("renders the score and author", () => {
    const story = createStory({ score: 42, by: "johndoe" });

    renderStoryByline(story, false);

    expect(screen.getByText(/42 points by johndoe/)).toBeInTheDocument();
  });

  it("renders the relative time", () => {
    const story = createStory();

    renderStoryByline(story, false);

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("shows the comments link when showCommentLink is true", () => {
    const story = createStory({ descendants: 15 });

    renderStoryByline(story, true);

    expect(screen.getByText("15 comments")).toBeInTheDocument();
  });

  it("hides the comments link when showCommentLink is false", () => {
    const story = createStory({ descendants: 15 });

    renderStoryByline(story, false);

    expect(screen.queryByText("15 comments")).not.toBeInTheDocument();
  });
});
