import { ViewModel } from "@view-models/core";
import { IHackerNewsApi } from "../api/HackerNewsApi";
import type { Comment } from "../types/Comment";
import { toError } from "../utils/toError";

type State = {
  error: Error | null;
  comment: Comment | null;
  loading: boolean;
};

export class CommentViewModel extends ViewModel<State> {
  private api: IHackerNewsApi;
  readonly id: string;

  constructor(api: IHackerNewsApi, id: string) {
    super({ loading: false, comment: null, error: null });
    this.api = api;
    this.id = id;
  }

  async load() {
    if (this.state.loading || this.state.comment) {
      return;
    }

    try {
      super.update({ loading: true });
      const comment = await this.api.fetchComment(this.id);
      super.update({ loading: false, error: null, comment });
    } catch (err) {
      super.update({ loading: false, error: toError(err) });
    }
  }
}
