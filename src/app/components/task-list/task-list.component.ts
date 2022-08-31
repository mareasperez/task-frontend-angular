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
    this.taskService.getTasks().subscribe((tasks: TaskModel[]) => {
      this.taskList = tasks;
    });
  }

  ngOnInit(): void {
    console.log(this.taskList);
  }
  deleteTask(id: string) {
    this.taskList = this.taskList.filter(task => task.id !== id);
  }
}
