import { Customer } from "./customer";

export interface Session {
  id: number;
  customer: Customer;
  day_session: "morning" | "afternoon" | "evening";
  session_date: string;
  created_at: string;
}
