import { Person } from '.';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  people: Person[];
}
