import { apiClient } from "../axios/axios";
import { Query } from "../types/query";
import { UpdateUserPayload } from "../types/user";
import { CreateUserPayload } from "../types/user";

export function fetchUsers(query?: Query) {
  return apiClient.get("/users", { params: query });
}

export function createUser(payload: CreateUserPayload) {
  return apiClient.post("/users", payload);
}

export function updateUser(payload: UpdateUserPayload, id: number) {
  return apiClient.patch(`/users/${id}`, payload);
}

export function removeUser(id: number) {
  return apiClient.delete(`/users/${id}`);
}
