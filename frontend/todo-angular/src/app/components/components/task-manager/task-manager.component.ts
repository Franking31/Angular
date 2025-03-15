import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../services/Task.Service';
import { Task, TaskStatus } from '../../../models/task';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
})
export class TaskManagerComponent implements OnInit {
  tasks: Task[] = [];
  taskForm: FormGroup;
  selectedFile: File | null = null;
  taskStatus = TaskStatus;
  displayedColumns: string[] = ['title', 'description', 'status', 'actions'];
  editMode: boolean = false;
  selectedTask: Task | null = null;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      projectId: [1, Validators.required],
      plannedEndDate: ['', Validators.required],
      startDate: ['', Validators.required],
      status: [TaskStatus.PENDING],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    if (this.editMode) {
      if (!this.selectedTask) return;

      const updatedTask: Partial<Task> = {
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        projectId: this.taskForm.get('projectId')?.value,
        status: this.taskForm.get('status')?.value,
        endDate: this.taskForm.get('plannedEndDate')?.value,
        startDate: this.taskForm.get('startDate')?.value,
      };

      this.taskService.updateTask(this.selectedTask.id!, updatedTask).subscribe(
        () => {
          this.loadTasks();
          this.cancelEdit();
        },
        (error: any) => {
          console.error('Erreur lors de la mise à jour', error);
          alert('Erreur lors de la mise à jour');
        }
      );
    } else {
      if (!this.selectedFile) {
        alert('Veuillez sélectionner une image.');
        return;
      }

      const formData = new FormData();
      formData.append('title', this.taskForm.get('title')?.value);
      formData.append('description', this.taskForm.get('description')?.value);
      formData.append('projectId', this.taskForm.get('projectId')?.value.toString());
      formData.append('status', this.taskForm.get('status')?.value);
      formData.append('startDate', this.taskForm.get('startDate')?.value);
      formData.append('endDate', this.taskForm.get('plannedEndDate')?.value);
      formData.append('image', this.selectedFile);

      this.taskService.createTask(formData).subscribe(
        (newTask: Task) => {
          this.tasks.push(newTask);
          this.taskForm.reset();
          this.selectedFile = null;
        },
        (error: any) => {
          console.error('Erreur lors de la création', error);
          alert('Erreur lors de la création');
        }
      );
    }
  }

  editTask(task: Task): void {
    this.editMode = true;
    this.selectedTask = { ...task };
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      startDate: task.startDate,
      plannedEndDate: task.endDate,
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.selectedTask = null;
    this.taskForm.reset();
    this.selectedFile = null;
  }

  startTask(id: number): void {
    this.taskService.startTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  completeTask(id: number): void {
    this.taskService.completeTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
}