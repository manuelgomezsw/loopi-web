export interface Shift {
  id?: number;
  name: string;
  period: 'weekly' | 'biweekly' | 'monthly';
  start_time: string;  // "07:30:00"
  end_time: string;    // "19:30:00"
  lunch_minutes: number;
  is_active: boolean;
  store_id: number;
}
