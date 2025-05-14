import { apiClient } from "../axios/axios";
import { DateRange } from "../types/dateRange";
import { Query } from "../types/query";

export function fetchHistories(query?: Query & DateRange) {
  return apiClient.get("/history", { params: query });
}

export function fetchHistory(id: number) {
  return apiClient.get(`/history/${id}`);
}

export function removeHistory(id: number) {
  return apiClient.delete(`/history/${id}`);
}

export function removeMultiHistories(ids: number[]) {
  return apiClient.post(`/history/remove-multi`, { ids });
}

export function fetchCustomerHistories(customer_id: number) {
  return apiClient.get(`/history/customer/${customer_id}`);
}

export function fetchCameraHistories(camera_id: number) {
  return apiClient.get(`/history/camera/${camera_id}`);
}
