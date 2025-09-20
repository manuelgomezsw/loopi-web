export interface EmployeeShift {
  id?: number;
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string; // Concatenación de first_name + last_name
  };
  shift: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  };
  start_date: string; // Fecha de inicio de la asignación
  end_date: string; // Fecha de fin de la asignación
  month: number; // Mes de la asignación
  year: number; // Año de la asignación
}
