export interface Customer {
  id: number;
  role: string;
  name: string;
  detail_info: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerPayload {
  role: string;
  name: string;
  detail_info: string;
}

export interface UpdateCustomerPayload {
  role: string;
  name: string;
  detail_info: string;
}
