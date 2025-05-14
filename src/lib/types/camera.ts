export interface Camera {
  id: number;
  title: string;
  sub_title: string;
  floor_num: number;
  floor_sub_num: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCameraPayload {
  title: string;
  sub_title: string;
  floor_num: number;
  floor_sub_num: number;
}

export interface UpdateCameraPayload {
  title: string;
  sub_title: string;
  floor_num: number;
  floor_sub_num: number;
}
