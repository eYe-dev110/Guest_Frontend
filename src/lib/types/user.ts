export interface User {
  id: number;
  role: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  user_name: string;
  password: string;
  passwordconf: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserPayload {
  role_id: number;
  user_name: string;
  password: string;
  passwordconf: string;
  is_active: boolean;
}

export interface CreateUserPayload {
  role_id: number;
  user_name: string;
  password: string;
  passwordconf: string;
  is_active: boolean;
}
