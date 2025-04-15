import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService, ApiResponse, User } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
  ],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() mode: 'view' | 'edit' | 'add' = 'add';
  @Input() user: User | null = null;
  @Output() closeDialog = new EventEmitter<void>();

  userForm: FormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  maxDate = new Date();
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      middlename: ['', Validators.pattern('^[a-zA-Z ]*$')],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(130)]],
      phoneno: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      bloodgroup: ['', Validators.required],
      dob: ['', Validators.required],
      address: this.fb.array([this.createAddressGroup()]),
    });
  }

  ngOnInit(): void {
    this.updateFormState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['user']) {
      this.updateFormState();
    }
  }

  updateFormState(): void {
    if (this.mode === 'view') {
      this.userForm.disable();
      this.addressArray.disable();
      this.addressArray.controls.forEach((control) => {
        if (control instanceof FormGroup) {
          control.disable();
        }
      });
    } else {
      this.userForm.enable();
      this.addressArray.controls.forEach((control) => {
        if (control instanceof FormGroup) {
          control.enable();
        }
      });
    }

    if (this.user) {
      this.loadUserData();
    } else if (this.mode === 'add') {
      this.userForm.reset();
      while (this.addressArray.length) {
        this.addressArray.removeAt(0);
      }
      this.addressArray.push(this.createAddressGroup());
    }
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      line1: ['', Validators.required],
      line2: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  get addressArray(): FormArray {
    return this.userForm.get('address') as FormArray;
  }

  addAddress(): void {
    this.addressArray.push(this.createAddressGroup());
  }

  removeAddress(index: number): void {
    if (this.addressArray.length > 1) {
      this.addressArray.removeAt(index);
    }
  }

  loadUserData(): void {
    this.loading = true;


    while (this.addressArray.length) {
      this.addressArray.removeAt(0);
    }

    this.user?.address.forEach((address) => {
      this.addressArray.push(this.createAddressGroup());
    });

    this.userForm.patchValue({
      name: this.user?.name,
      middlename: this.user?.middlename,
      lastname: this.user?.lastname,
      age: this.user?.age,
      phoneno: this.user?.phoneno,
      bloodgroup: this.user?.bloodgroup,
      dob: new Date(this.user?.dob || ''),
      address: this.user?.address,
    });
    this.loading = false;
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.loading && this.mode !== 'view') {
      this.loading = true;
      const userData = this.userForm.value;

      // Convert dob to ISO string if it's a Date object
      if (userData.dob instanceof Date) {
        userData.dob = userData.dob.toISOString();
      }

      const handleResponse = (response: ApiResponse) => {
        this.loading = false;
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.mode === 'edit'
              ? `User ${this.user?.name} ${this.user?.lastname} updated successfully`
              : 'New user created successfully',
            // life: 3000
          });
          this.closeDialog.emit();
        }, 0);
      };

      const handleError = (error: any) => {
        this.loading = false;
        console.error('Error:', error);
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message ?? (this.mode === 'edit' ? 'Failed to update user' : 'Failed to create user'),
            // life: 3000
          });
        }, 0);
      };

      if (this.mode === 'edit' && this.user?._id) {
        this.userService.updateUser(this.user._id, userData).subscribe({
          next: handleResponse,
          error: handleError
        });
      } else if (this.mode === 'add') {
        this.userService.createUser(userData).subscribe({
          next: handleResponse,
          error: handleError
        });
      }
    } else if (this.mode !== 'view') {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(nestedKey => {
            control.get(nestedKey)?.markAsTouched();
          });
        } else {
          control?.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    this.closeDialog.emit();
  }
}
