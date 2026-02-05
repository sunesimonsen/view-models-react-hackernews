import { ViewModel } from "@view-models/core";
import type { Story } from "../types/Story";
import { toError } from "../utils/toError";
import { IHackerNewsApi } from "../api/HackerNewsApi";

type State = {
  error: Error | null;
  story: Story | null;
  loading: boolean;
};

export class StoryViewModel extends ViewModel<State> {
  private api: IHackerNewsApi;
  readonly id: string;

  constructor(api: IHackerNewsApi, id: string) {
    super({ loading: false, story: null, error: null });
    this.api = api;
    this.id = id;
  }

  async load() {
    if (this.state.loading || this.state.story) {
      return;
    }

    try {
      super.update({ loading: true });
      const story = await this.api.fetchStory(this.id);
      super.update({ loading: false, error: null, story });
    } catch (err) {
      super.update({ loading: false, error: toError(err) });
    }
  }
}
