export interface Comment {
  id: string;
  text: string;
  by: string;
  time: number;
  parentId: string;
  answers: string[];
}
