import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StoryLink } from "./StoryLink";
import type { Story } from "../types/Story";

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

describe("StoryLink", () => {
  it("renders the story title as link text", () => {
    const story = createStory({ title: "Amazing Discovery" });

    render(<StoryLink story={story} />);

    expect(screen.getByText("Amazing Discovery")).toBeInTheDocument();
  });

  it("links to the story url", () => {
    const story = createStory({ url: "https://news.example.com/article" });

    render(<StoryLink story={story} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://news.example.com/article");
  });

  it("sets the title attribute to the story title", () => {
    const story = createStory({ title: "Story Title Here" });

    render(<StoryLink story={story} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("title", "Story Title Here");
  });

  it("opens in a new tab", () => {
    const story = createStory();

    render(<StoryLink story={story} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
