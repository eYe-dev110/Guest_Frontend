import { apiClient } from "../axios/axios";
import {
  UpdateCustomerPayload,
  CreateCustomerPayload,
} from "../types/customer";
import { Query } from "../types/query";
import { DateRange } from "../types/dateRange";

export function fetchCustomers(query?: Query) {
  return apiClient.get("/customers", { params: query });
}

export function createCustomer(payload: CreateCustomerPayload) {
  return apiClient.post("/customers", payload);
}

export function fetchCustomer(id: string) {
  return apiClient.get(`/customers/${id}`);
}

export function updateCustomer(id: number, payload: UpdateCustomerPayload) {
  return apiClient.patch(`/customers/${id}`, payload);
}

export function removeCustomer(id: number) {
  return apiClient.delete(`/customers/${id}`);
}

export function fetchCustomerCountOfTodayByRole() {
  return apiClient.get(`/customers/today-count-by-role`);
}

export function fetchCustomerCountOfMonthByRole() {
  return apiClient.get(`/customers/month-count-by-role`);
}

export function fetchCustomerDailyCountByRole(payload?: DateRange) {
  return apiClient.get(`/customers/daily-count-by-role`, { params: payload });
}
