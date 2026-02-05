import { TopStoriesViewModel } from "./TopStoriesViewModel";
import { IHackerNewsApi } from "../api/HackerNewsApi";
import { CommentViewModel } from "./CommentViewModel";
import { StoryViewModel } from "./StoryViewModel";

export class HackerNewsModel {
  private api: IHackerNewsApi;
  readonly topStories: TopStoriesViewModel;

  private storyById = new Map<string, StoryViewModel>();
  private commentById = new Map<string, CommentViewModel>();

  constructor(api: IHackerNewsApi) {
    this.api = api;
    this.topStories = new TopStoriesViewModel(api);
    this.topStories.load();
  }

  getStory(id: string) {
    let model = this.storyById.get(id);
    if (!model) {
      model = new StoryViewModel(this.api, id);
      model.load();
      this.storyById.set(id, model);
    }
    return model;
  }

  getComment(id: string) {
    let model = this.commentById.get(id);
    if (!model) {
      model = new CommentViewModel(this.api, id);
      model.load();
      this.commentById.set(id, model);
    }
    return model;
  }
}
