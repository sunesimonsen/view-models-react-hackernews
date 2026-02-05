import { ViewModel } from "@view-models/core";
import { toError } from "../utils/toError";
import { HackerNewsApi, IHackerNewsApi } from "../api/HackerNewsApi";

type State = {
  error: Error | null;
  topStoryIds: string[];
  shownTopStoryIds: string[];
  hasMore: boolean;
  loading: boolean;
};

const PAGE_SIZE = 20;

export class TopStoriesViewModel extends ViewModel<State> {
  private api: IHackerNewsApi;

  constructor(api: IHackerNewsApi = new HackerNewsApi()) {
    super({
      error: null,
      topStoryIds: [],
      shownTopStoryIds: [],
      hasMore: false,
      loading: false,
    });
    this.api = api;
  }

  load = async (force = false) => {
    if (!force && (this.state.loading || this.state.topStoryIds.length > 0)) {
      return;
    }

    try {
      super.update({ loading: true });
      const ids = await this.api.fetchTopStoryIds();
      const shownIds = ids.slice(0, PAGE_SIZE);
      super.update({
        loading: false,
        error: null,
        topStoryIds: ids,
        shownTopStoryIds: shownIds,
        hasMore: true,
      });
    } catch (err) {
      super.update({ loading: false, error: toError(err) });
    }
  };

  reload = async () => {
    return this.load(true);
  };

  loadMore = () => {
    if (!this.state.hasMore) return;

    const { topStoryIds: ids, shownTopStoryIds: shownIds } = this.state;
    const newIds = ids.slice(shownIds.length, shownIds.length + PAGE_SIZE);
    const hasMore = ids.length > shownIds.length + newIds.length;
    super.update({ shownTopStoryIds: [...shownIds, ...newIds], hasMore });
  };
}
