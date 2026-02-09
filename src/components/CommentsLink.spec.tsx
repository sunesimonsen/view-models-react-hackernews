import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { CommentsLink } from "./CommentsLink";
import type { Story } from "../types/Story";
import { routes } from "./routes";

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

describe("CommentsLink", () => {
  const renderCommentsLink = (story: Story) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <Router history={history} routes={routes}>
        <CommentsLink story={story} />
      </Router>
    );
  };

  it("renders the number of comments", () => {
    const story = createStory({ descendants: 42 });

    renderCommentsLink(story);

    expect(screen.getByText("42 comments")).toBeInTheDocument();
  });

  it("links to the story route with the story id", () => {
    const story = createStory({ id: "456", descendants: 10 });

    renderCommentsLink(story);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/stories/456");
  });

  it("renders nothing when descendants is zero", () => {
    const story = createStory({ descendants: 0 });

    const { container } = renderCommentsLink(story);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when descendants is negative", () => {
    const story = createStory({ descendants: -1 });

    const { container } = renderCommentsLink(story);

    expect(container).toBeEmptyDOMElement();
  });
});
