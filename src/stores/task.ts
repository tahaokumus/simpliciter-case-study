import { defineStore } from "pinia";
import {
  createTask,
  deleteTask,
  fetchTask,
  fetchTasks,
  updateTask,
} from "@/services/taskService";
import type Task from "@/models/Task";
import type { NewTask } from "@/models/Task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as Task[],
  }),
  getters: {
    getTasks: (state) => state.tasks,
    getTaskById: (state) => (id: string) =>
      state.tasks.find((task) => task.id === id),
    getDisticntTags: (state) => {
      return state.tasks.reduce((acc, task) => {
        task.tags.forEach((tag) => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
        return acc;
      }, [] as string[]);
    },
  },
  actions: {
    async fetchTasks() {
      const tasks = await fetchTasks();
      this.tasks = tasks;
    },
    async fetchTask(id: string) {
      const task = await fetchTask(id);
      this.tasks.push(task);
    },
    async createTask(task: NewTask) {
      const newTask = await createTask(task);
      this.tasks.push(newTask);
    },
    async updateTask(task: Task) {
      const updatedTask = await updateTask(task);
      const index = this.tasks.findIndex((t) => t.id === task.id);
      this.tasks[index] = updatedTask;
    },
    async deleteTask(id: string) {
      await deleteTask(id);
      const index = this.tasks.findIndex((t) => t.id === id);
      this.tasks.splice(index, 1);
    },
  },
});
