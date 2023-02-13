import type { NewTask } from "@/models/Task";
import type Task from "@/models/Task";

const API_URL = "http://localhost:3000/tasks";

async function tryFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchTasks(): Promise<Task[]> {
  return tryFetch<Task[]>(API_URL);
}

async function fetchTask(id: string): Promise<Task> {
  return tryFetch<Task>(`${API_URL}/${id}`);
}

async function createTask(task: NewTask): Promise<Task> {
  return tryFetch<Task>(API_URL, {
    method: "POST",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function updateTask(task: Task): Promise<Task> {
  return tryFetch<Task>(`${API_URL}/${task.id}`, {
    method: "PUT",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function deleteTask(id: string): Promise<Task> {
  return tryFetch<Task>(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

export { fetchTasks, fetchTask, createTask, updateTask, deleteTask };
