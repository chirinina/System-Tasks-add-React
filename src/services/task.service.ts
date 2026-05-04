import type { AxiosInstance } from 'axios';
import type { Task, TasksResponse } from '../interfaces';

export class TaskService {
  constructor(private readonly axiosClient: AxiosInstance) {}

  async getTasks(): Promise<TasksResponse> {
    const { data } = await this.axiosClient.get<TasksResponse>('/tasks');
    return data;
  }

  async getTaskById(id: number): Promise<Task> {
    const { data } = await this.axiosClient.get<Task>(`/tasks/${id}`);
    return data;
  }

  async createTask(name: string): Promise<Task> {
    const { data } = await this.axiosClient.post<any>('/tasks', { name });
    return data.data || data;
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const { data } = await this.axiosClient.put<any>(`/tasks/${id}`, task);
    return data.data || data;
  }

  async patchTask(id: number, task: Partial<Task>): Promise<Task> {
    const { data } = await this.axiosClient.patch<any>(`/tasks/${id}`, task);
    return data.data || data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.axiosClient.delete(`/tasks/${id}`);
  }
}
