import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User, UserService, UserPaginatedResponse } from '../../services/user.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    ButtonModule,
    PaginatorModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    UserFormComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  users: User[] = [];
  loading = true;
  totalRecords = 0;
  rows = 5;
  currentPage = 1;
  showUserDialog = false;
  selectedUser: User | null = null;
  dialogMode: 'view' | 'edit' | 'add' = 'view';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;

    this.userService.getUsers(page, this.rows).subscribe({
      next: (response: UserPaginatedResponse) => {
        this.users = response.users || [];
        this.totalRecords = response.total || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(event: any): void {
    this.rows = event.rows;
    this.loadUsers(event.page + 1);
  }

  createNewUser(): void {
    this.dialogMode = 'add';
    this.selectedUser = null;
    this.showUserDialog = true;
  }

  onView(user: User): void {
    this.dialogMode = 'view';
    this.selectedUser = user;
    this.showUserDialog = true;
  }

  onEdit(user: User): void {
    this.dialogMode = 'edit';
    this.selectedUser = user;
    this.showUserDialog = true;
  }

  onDialogClose(): void {
    this.showUserDialog = false;
    this.selectedUser = null;
    this.loadUsers(this.currentPage);
  }

  confirmDelete(user: User, event: Event): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.name} ${user.lastname}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (user._id) {
          this.deleteUser(user._id);
        }
      },
    });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
          life: 2000,
        });
        this.loadUsers(this.currentPage);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user',
          life: 2000,
        });
      }
    });
  }

  getBloodGroupClass(bloodGroup: string): string {
    const colorMap: Record<string, string> = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-pink-100 text-pink-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-indigo-100 text-indigo-800',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-teal-100 text-teal-800',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-violet-100 text-violet-800',
    };

    return colorMap[bloodGroup] || 'bg-gray-100 text-gray-800';
  }
}


