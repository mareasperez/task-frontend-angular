import { Component, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  public taskList = Array<TaskModel>();
  public editingTask: TaskModel = {} as TaskModel;
  constructor(private taskService: TaskService) {
    this.taskService.getTaskList$().subscribe(taskList => {
      this.taskList = taskList;
    });
    this.taskService.getEditingTask().subscribe(task => {
      this.editingTask = task;
    });
  }

  ngOnInit(): void {
    console.log(this.taskList);
  }
  deleteTask(id: string) {
    console.log('deleting task ' + id);
    this.taskService.deleteTask(id).subscribe(() => {});
  }

  updateTask(task: TaskModel) {
    this.taskService.updateTask(task).subscribe(() => {
      this.taskList = this.taskList.filter(t => t.id !== task.id);
      this.taskList.push(task);
    });
    this.taskService.setTaskList(this.taskList);
  }
  setTaskToUpdate(id: string) {
    const task = this.taskList.find(t => t.id === id);
    this.editingTask = task as TaskModel;
    console.log(this.editingTask);
    this.taskService.setEditingTask(task as TaskModel);
  }
}
