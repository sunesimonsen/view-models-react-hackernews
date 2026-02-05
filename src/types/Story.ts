export interface Story {
  id: string;
  title: string;
  score: number;
  by: string;
  time: number;
  url: string;
  descendants: number;
  comments: string[];
}
