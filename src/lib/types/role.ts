export interface Role {
  id: number;
  name: RoleName;
  created_at: string;
  updated_at: string;
}

export interface CreateRolePayload {
  name: RoleName;
}

export interface UpdateRolePayload {
  name: RoleName;
}

export type RoleName = "user" | "client" | "employeer";
