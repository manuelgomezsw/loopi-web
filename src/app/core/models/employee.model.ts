export interface Employee {
  id: number;
  username: string;
  name: string;
  last_name: string;
  full_name: string;
  role: 'employee' | 'admin';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  employee: Employee;
}
