import { environment } from '../../environments/environment.development';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
  line1: string;
  line2: string;
  city: string;
}

export interface User {
  _id?: string;
  name: string;
  middlename?: string;
  lastname: string;
  age: number;
  phoneno: string;
  bloodgroup: string;
  dob: Date;
  address: Address[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface UserPaginatedResponse {
  total: number;
  page: number;
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  getUsers(page: number, rows: number): Observable<UserPaginatedResponse> {
    return this.http.get<UserPaginatedResponse>(`${this.apiUrl}/api/users?page=${page}&limit=${rows}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  }

  createUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/api/users`, user);
  }

  updateUser(id: string, user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/api/users/${id}`, user);
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/api/users/${id}`);
  }
}
