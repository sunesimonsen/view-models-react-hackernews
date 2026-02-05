import type { Story } from "../types/Story";
import type { Comment } from "../types/Comment";

export interface IHackerNewsApi {
  fetchTopStoryIds(): Promise<string[]>;
  fetchStory(id: string): Promise<Story>;
  fetchComment(id: string): Promise<Comment>;
}

type StoryItem = {
  id: number;
  title: string;
  score: number;
  by: string;
  time: number;
  url: string;
  descendants: number;
  kids?: number[];
};

type CommentItem = {
  id: number;
  text: string;
  by: string;
  time: number;
  parent: number;
  kids?: number[];
};

export class HackerNewsApi {
  private readonly baseUrl = "https://hacker-news.firebaseio.com/v0";

  async fetchTopStoryIds(): Promise<string[]> {
    const ids = await this.fetchJson<number[]>(
      `${this.baseUrl}/topstories.json`,
    );
    return ids.map(String);
  }

  async fetchStory(id: string): Promise<Story> {
    const response = await this.fetchJson<StoryItem>(
      `${this.baseUrl}/item/${id}.json`,
    );

    return {
      id: String(response.id),
      title: response.title,
      score: response.score,
      by: response.by,
      time: response.time,
      url: response.url,
      descendants: response.descendants || 0,
      comments: (response.kids || []).map(String),
    };
  }

  async fetchComment(id: string): Promise<Comment> {
    const response = await this.fetchJson<CommentItem>(
      `${this.baseUrl}/item/${id}.json`,
    );

    return {
      id: String(response.id),
      text: response.text || "",
      by: response.by || "[deleted]",
      time: response.time,
      parentId: String(response.parent),
      answers: (response.kids || []).map(String),
    };
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  }
}
