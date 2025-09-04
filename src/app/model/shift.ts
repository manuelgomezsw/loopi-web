export interface Shift {
  id?: number;
  name: string;
  period: 'semanal' | 'quincenal' | 'mensual';
  start_time: string;
  end_time: string;
  lunch_minutes: number;
  is_active: boolean;
  store_id: number;
}
