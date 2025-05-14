import { apiClient } from "../axios/axios";
import { Query } from "../types/query";
import { CreateRolePayload, UpdateRolePayload } from "../types/role";

export function fetchRoles(query?: Query) {
  return apiClient.get("/roles", { params: query });
}

export function createRole(payload: CreateRolePayload) {
  return apiClient.post("/roles", payload);
}

export function fetchRole(id: string) {
  return apiClient.get(`/roles/${id}`);
}

export function updateRole(id: number, payload: UpdateRolePayload) {
  return apiClient.patch(`/roles/${id}`, payload);
}

export function removeRole(id: number) {
  return apiClient.delete(`/roles/${id}`);
}
