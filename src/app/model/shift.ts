export interface Shift {
  id?: number;
  name: string;
  start_time: string;
  end_time: string;
  lunch_minutes: number;
  is_active?: boolean; // Opcional - solo se maneja desde el backend y la lista
  store_id: number;
}
