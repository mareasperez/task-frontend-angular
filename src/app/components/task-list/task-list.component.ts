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
  constructor(private taskService: TaskService) {
    this.taskService.getTaskList$().subscribe(taskList => {
      this.taskList = taskList;
    });
  }

  ngOnInit(): void {
    console.log(this.taskList);
  }
  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.taskList = this.taskList.filter(task => task.id !== id);
    });
    this.taskService.setTaskList(this.taskList);
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
    this.taskService.setEditingTask(task as TaskModel);
  }
}
