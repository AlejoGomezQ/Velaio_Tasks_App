import { Person } from '.';

export interface Task {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;
  people: Person[];
}
