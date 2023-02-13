export default interface Task {
  id: string;
  title: string;
  tags: string[];
  endDate: string;
  state: "todo" | "completed";
  description: string;
}

export interface NewTask extends Omit<Task, "id"> {}
