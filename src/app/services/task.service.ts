import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskModel } from '../models/task.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private client: HttpClient;
  private env = environment;
  private taskList = Array<TaskModel>();
  private editingTask: BehaviorSubject<TaskModel>;
  private taskList$: BehaviorSubject<Array<TaskModel>>;
  constructor(client: HttpClient, private toastr: ToastrService) {
    this.taskList$ = new BehaviorSubject(new Array<TaskModel>());
    this.client = client;
    this.editingTask = new BehaviorSubject({} as TaskModel);
  }
  loadTask() {
    this.getTasks().subscribe(taskList => {
      console.log(taskList);
      this.setTaskList(taskList);
      this.showSuccess('Task loaded');
    });
  }
  getTasks(): Observable<TaskModel[]> {
    return this.client.get<TaskModel[]>(this.env.API_URL + '/Task');
  }
  createtask(task: TaskModel){
    console.log('createtask', task);
    return this.client.post(this.env.API_URL + '/Task', task);
  }
  deleteTask(id: string) {
    console.log('deleteTask', id);
    const dTask = this.client.delete(this.env.API_URL + '/Task/' + id, {
      observe: 'response',
    });
    dTask.subscribe(response => {
      console.log(response);
      if (response.status === 204) {
        this.showWarning('Task deleted');
        this.setTaskList(this.getTaskList().filter(t => t.id !== id));
      } else {
        this.showError('Task not deleted');
      }
    });
    return dTask;
  }
  updateTask(task: TaskModel) {
    const utask = this.client.put(this.env.API_URL + '/Task/' + task.id, task, {
      observe: 'response',
    });
    utask.subscribe(response => {
      if (response.status === 204) {
        this.showInfo('Task updated');
        this.setTaskList(
          this.getTaskList().map(t => {
            if (t.id === task.id) {
              return task;
            }
            return t;
          })
        );
      } else {
        this.showError('Task not updated');
      }
    });
    return utask;
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
  showInfo(message: string) {
    this.toastr.info(message);
  }
  showWarning(message: string) {
    this.toastr.warning(message);
  }
  showError(message: string) {
    this.toastr.error(message);
  }
  showSuccess(message: string) {
    this.toastr.success(message);
  }
}
