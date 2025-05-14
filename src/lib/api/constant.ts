import { apiClient } from "../axios/axios";
import { Query } from "../types/query";

export function fetchConstants(query?: Query) {
  return apiClient.get("/constants", { params: query });
}

export function fetchConstant(id: string) {
  return apiClient.get(`/constants/${id}`);
}

export function createConstant(payload: { name: string; value: string }) {
  return apiClient.post("/constants", payload);
}

export function updateConstant(
  id: number,
  payload: { name: string; value: string },
) {
  return apiClient.patch(`/constants/${id}`, payload);
}

export function removeConstant(id: number) {
  return apiClient.delete(`/constants/${id}`);
}

export function fetchConstantByName(name: string) {
  return apiClient.get(`/constants/name/${name}`);
}
