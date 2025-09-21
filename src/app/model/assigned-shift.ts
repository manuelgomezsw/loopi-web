export interface AssignedShift {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  shift_id: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  shift: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    working_days: string[];
  };
}

export interface AssignedShiftResponse {
  data: AssignedShift[];
}
