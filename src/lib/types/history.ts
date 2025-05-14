import { Camera } from "./camera";
import { Customer } from "./customer";

export interface History {
  id: number;
  customer: Customer;
  camera: Camera;
  seen_at: string;
  created_at: string;
}
