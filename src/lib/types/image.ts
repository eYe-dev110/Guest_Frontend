import { Camera } from "./camera";
import { Customer } from "./customer";
import { History } from "./history";

export interface ImageType {
  id: number;
  customer: Customer | null;
  url: string;
  created_at: Date;
}

export interface CreateImagePayload {
  customer_id?: number;
  url: string;
}

export interface UpdateImagePayload {
  customer_id?: number;
  url?: string;
}
