export interface Constant {
  id: number;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface CreateConstantPayload {
  name: string;
  value: string;
}

export interface UpdateConstantPayload {
  name: string;
  value: string;
}
