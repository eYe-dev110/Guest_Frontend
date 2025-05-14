import { apiClient } from "../axios/axios";
import { CreateImagePayload, UpdateImagePayload } from "../types/image";
import { Query } from "../types/query";

export function fetchImages(query?: Query) {
  return apiClient.get("/images", { params: query });
}

export function createImage(payload: CreateImagePayload) {
  return apiClient.post("/images", payload);
}

export function updateImage(id: number, payload: UpdateImagePayload) {
  return apiClient.patch(`/images/${id}`, payload);
}

export function removeImage(id: number) {
  return apiClient.delete(`/images/${id}`);
}

export function removeMultiImages(ids: number[]) {
  return apiClient.post(`/images/remove-multi`, { ids });
}

export function fetchImage(id: number) {
  return apiClient.get(`/images/${id}`);
}

export function fetchCustomerImages(customer_id: number) {
  return apiClient.get(`/images/customer/${customer_id}`);
}

export function fetchHistoryImages(history_id: number) {
  return apiClient.get(`/images/history/${history_id}`);
}

export function fetchImagesByType(ImageType: string) {
  return apiClient.get(`/images/type/${ImageType}`);
}
