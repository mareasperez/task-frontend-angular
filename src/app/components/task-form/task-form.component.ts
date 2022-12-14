import { Component, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
// form group is a group of form controls
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  public form: FormGroup;
  constructor(private fb: FormBuilder, private taskService: TaskService) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\.(jpg|jpeg|png|webp|avif|gif|svg)$/;
    this.form = this.fb.group({
      id: null,
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      image: new FormControl('', [Validators.required,Validators.pattern(urlRegex)]),
    });
    this.taskService.getEditingTask().subscribe((task: TaskModel) => {
      if (task) {
        this.form.patchValue(task);
      }
    });
  }

  ngOnInit(): void {
    console.log(this.form);
  }
  saveTask() {
    const task = this.form.value;
    if (task.id) {
      this.taskService.updateTask(task).subscribe(() => {
        this.taskService.setEditingTask({} as TaskModel);
        this.form.reset();
      });
    } else {
      this.taskService.createtask(task).subscribe(() => {
        this.taskService.setTaskList(this.taskService.getTaskList().concat(task));
        this.form.reset();
      });
    }
  }

  get Form(): FormGroup['controls'] {
    return this.form.controls;
  }

  logForm(): void {
    console.log(this.form);
  }
  cancel(){
    this.form.reset();
    this.taskService.setEditingTask({} as TaskModel);
  }
}
