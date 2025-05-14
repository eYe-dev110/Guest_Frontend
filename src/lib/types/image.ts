import { Camera } from "./camera";
import { Customer } from "./customer";
import { History } from "./history";

export interface ImageType {
  id: number;
  customer: Customer | null;
  camera: Camera | null;
  history: History | null;
  image_type: "camera" | "face" | null;
  url: string;
  created_at: Date;
}

export interface CreateImagePayload {
  customer_id?: number;
  camera_id?: number;
  history_id?: number;
  image_type: "camera" | "face" | null;
  url: string;
}

export interface UpdateImagePayload {
  customer_id?: number;
  camera_id?: number;
  history_id?: number;
  image_type: "camera" | "face" | null;
  url?: string;
}
