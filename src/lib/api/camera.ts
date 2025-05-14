import { apiClient } from "../axios/axios";
import { CreateCameraPayload, UpdateCameraPayload } from "../types/camera";
import { Query } from "../types/query";

export function fetchCameras(query?: Query) {
  return apiClient.get("/cameras", { params: query });
}

export function fetchCamera(id: string) {
  return apiClient.get(`/cameras/${id}`);
}

export function createCamera(payload: CreateCameraPayload) {
  return apiClient.post("/cameras", payload);
}

export function updateCamera(id: number, payload: UpdateCameraPayload) {
  return apiClient.patch(`/cameras/${id}`, payload);
}

export function removeCamera(id: number) {
  return apiClient.delete(`/cameras/${id}`);
}
