import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StoryCard, StoryTitle, StoryPlaceholder } from "./StoryLayout";

describe("StoryTitle", () => {
  it("renders children", () => {
    render(<StoryTitle>Title Text</StoryTitle>);

    expect(screen.getByText("Title Text")).toBeInTheDocument();
  });

  it("applies the story-title class", () => {
    const { container } = render(<StoryTitle>Title</StoryTitle>);

    expect(container.querySelector(".story-title")).toBeInTheDocument();
  });
});

describe("StoryCard", () => {
  it("renders as a list item", () => {
    render(<StoryCard>Card content</StoryCard>);

    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<StoryCard>Card content here</StoryCard>);

    expect(screen.getByText("Card content here")).toBeInTheDocument();
  });

  it("applies the story-card class", () => {
    render(<StoryCard>Content</StoryCard>);

    expect(screen.getByRole("listitem")).toHaveClass("story-card");
  });

  it("forwards ref to the list item", () => {
    const ref = { current: null as HTMLLIElement | null };
    render(<StoryCard ref={ref}>Content</StoryCard>);

    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });
});

describe("StoryPlaceholder", () => {
  it("renders a StoryCard", () => {
    render(<StoryPlaceholder />);

    expect(screen.getByRole("listitem")).toHaveClass("story-card");
  });

  it("renders skeleton placeholders", () => {
    render(<StoryPlaceholder />);

    const skeletons = document.querySelectorAll(".skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
