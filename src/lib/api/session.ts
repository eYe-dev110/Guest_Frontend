import { apiClient } from "../axios/axios";
import { Query } from "../types/query";
import { DateRange } from "../types/dateRange";

export function fetchSessions(query?: Query & DateRange) {
  return apiClient.get("/sessions", { params: query });
}

export function fetchSession(id: string) {
  return apiClient.get(`/sessions/${id}`);
}

export function removeSession(id: number) {
  return apiClient.delete(`/sessions/${id}`);
}

export function removeMultiSessions(ids: number[]) {
  return apiClient.post(`/sessions/remove-multi`, { ids });
}

export function fetchCustomerSessions(id: number) {
  return apiClient.get(`/sessions/customer/${id}`);
}
