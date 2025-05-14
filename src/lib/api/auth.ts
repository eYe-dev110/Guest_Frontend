// src/lib/api/auth.ts
import { apiClient } from "../axios/axios";

interface LoginPayload {
  user_name: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export function login(payload: LoginPayload) {
  return apiClient.post("/auth/login", payload);
}

export function register(payload: RegisterPayload) {
  return apiClient.post("/auth/register", payload);
}

export function logout() {
  return apiClient.post("/auth/logout");
}

export function getCurrentUser() {
  return apiClient.get("/auth/me");
}
