import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskModel } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private client: HttpClient;
  private env = environment;
  constructor(client: HttpClient) {
    this.client = client;
  }
  getTasks(): Observable<TaskModel[]> {
    return this.client.get<TaskModel[]>(this.env.API_URL + '/Task');
  }
}
