import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskModel } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private client: HttpClient;
  private env = environment;
  private taskList = Array<TaskModel>();
  private editingTask: BehaviorSubject<TaskModel>;
  private taskList$: BehaviorSubject<Array<TaskModel>>;
  constructor(client: HttpClient) {
    this.taskList$ = new BehaviorSubject(new Array<TaskModel>());
    this.client = client;
    this.editingTask = new BehaviorSubject({} as TaskModel);
  }
  loadTask() {
    this.getTasks().subscribe(taskList => {
      console.log(taskList);
      this.setTaskList(taskList);
    });
  }
  getTasks(): Observable<TaskModel[]> {
    return this.client.get<TaskModel[]>(this.env.API_URL + '/Task');
  }
  createtask(task: TaskModel): Observable<TaskModel> {
    return this.client.post<TaskModel>(this.env.API_URL + '/Task', task);
  }
  deleteTask(id: string) {
    return this.client.delete(this.env.API_URL + '/Task/' + id);
  }
  updateTask(task: TaskModel) {
    return this.client.put(this.env.API_URL + '/Task/' + task.id, task);
  }
  getTaskList$(): Observable<Array<TaskModel>> {
    return this.taskList$.asObservable();
  }
  getTaskList(): Array<TaskModel> {
    return this.taskList;
  }
  setTaskList(taskList: Array<TaskModel>) {
    this.taskList = taskList;
    this.taskList$.next(taskList);
  }
  getEditingTask(): Observable<TaskModel> {
    return this.editingTask.asObservable();
  }
  setEditingTask(task: TaskModel) {
    console.log('setEditingTask', task);
    this.editingTask.next(task);
  }
}
