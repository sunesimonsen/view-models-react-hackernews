import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { CommentAndAnswersLink } from "./CommentAndAnswersLink";
import type { Comment } from "../types/Comment";
import { routes } from "./routes";

const createComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: "123",
  text: "Test comment",
  by: "testuser",
  time: Date.now() / 1000,
  parentId: "456",
  answers: ["789"],
  ...overrides,
});

describe("CommentAndAnswersLink", () => {
  const renderCommentAndAnswersLink = (comment: Comment) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <Router history={history} routes={routes}>
        <CommentAndAnswersLink comment={comment} />
      </Router>
    );
  };

  it("renders the number of answers", () => {
    const comment = createComment({ answers: ["a1", "a2", "a3"] });

    renderCommentAndAnswersLink(comment);

    expect(screen.getByText("3 answers")).toBeInTheDocument();
  });

  it("links to the comment route with the comment id", () => {
    const comment = createComment({ id: "789", answers: ["a1"] });

    renderCommentAndAnswersLink(comment);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/comments/789");
  });

  it("renders nothing when there are no answers", () => {
    const comment = createComment({ answers: [] });

    const { container } = renderCommentAndAnswersLink(comment);

    expect(container).toBeEmptyDOMElement();
  });
});
