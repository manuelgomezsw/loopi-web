import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AssignedShift } from '../../../../model/assigned-shift';
import { CalendarDay, CalendarEvent, CalendarShift } from './interfaces/calendar-day.interface';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent implements OnInit, OnChanges {
  @Input() selectedMonth: number = new Date().getMonth() + 1;
  @Input() selectedYear: number = new Date().getFullYear();
  @Input() assignedShifts: AssignedShift[] = [];
  @Input() showWeekends = true;
  @Input() highlightToday = true;
  @Input() allowInteraction = true;

  @Output() dayClick = new EventEmitter<CalendarEvent>();
  @Output() shiftClick = new EventEmitter<CalendarEvent>();
  @Output() dayHover = new EventEmitter<CalendarEvent>();
  @Output() shiftHover = new EventEmitter<CalendarEvent>();
  @Output() monthChange = new EventEmitter<{ month: number; year: number }>();

  calendarDays: CalendarDay[] = [];
  calendarShifts: CalendarShift[] = [];
  monthName = '';

  // Filtro de empleados
  availableEmployees: { id: string; name: string }[] = [];
  selectedEmployeeId: string | null = null;

  private readonly monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  private readonly dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Mapeo de días en español a números de JavaScript Date.getDay()
  private readonly dayMapping: Record<string, number> = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6
  };

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] || changes['selectedYear'] || changes['assignedShifts']) {
      // Forzar limpieza completa antes de regenerar
      this.calendarDays = [];
      this.calendarShifts = [];

      // Regenerar calendario con datos frescos
      setTimeout(() => {
        this.generateCalendar();
      }, 0);
    }
  }

  onEmployeeFilterChange(employeeId: string | null): void {
    this.selectedEmployeeId = employeeId;
    this.generateCalendar();
  }

  previousMonth(): void {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.generateCalendar();
    this.monthChange.emit({ month: this.selectedMonth, year: this.selectedYear });
  }

  nextMonth(): void {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.generateCalendar();
    this.monthChange.emit({ month: this.selectedMonth, year: this.selectedYear });
  }

  private generateCalendar(): void {
    this.monthName = `${this.monthNames[this.selectedMonth - 1]} ${this.selectedYear}`;
    this.extractAvailableEmployees();
    this.calendarShifts = this.transformShiftsToCalendarFormat();
    this.calendarDays = this.generateCalendarDays();
  }

  private extractAvailableEmployees(): void {
    const employeeMap = new Map<string, string>();

    this.assignedShifts.forEach(shift => {
      const employeeId = shift.user.id.toString();
      const employeeName = `${shift.user.first_name} ${shift.user.last_name}`;
      employeeMap.set(employeeId, employeeName);
    });

    this.availableEmployees = Array.from(employeeMap.entries())
      .map(([id, name]) => ({
        id,
        name
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private generateCalendarDays(): CalendarDay[] {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    const lastDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 0);
    const today = new Date();

    // Calcular el primer día de la semana (Lunes = 1, Domingo = 0)
    // Convertir para que Lunes sea 0, Martes sea 1, etc.
    const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Lunes = 0

    // Agregar días del mes anterior si es necesario para completar la primera semana
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevDate = new Date(this.selectedYear, this.selectedMonth - 1, -i);
      const dayShifts = this.getShiftsForDay(prevDate);

      days.push({
        date: prevDate,
        dayNumber: prevDate.getDate(),
        dayName: this.dayNames[(prevDate.getDay() + 6) % 7], // Convertir a formato Lun-Dom
        isCurrentMonth: false,
        isToday: this.isSameDay(prevDate, today),
        shifts: dayShifts
      });
    }

    // Días del mes actual
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(this.selectedYear, this.selectedMonth - 1, day);
      const dayShifts = this.getShiftsForDay(currentDate);

      days.push({
        date: currentDate,
        dayNumber: day,
        dayName: this.dayNames[(currentDate.getDay() + 6) % 7], // Convertir a formato Lun-Dom
        isCurrentMonth: true,
        isToday: this.isSameDay(currentDate, today),
        shifts: dayShifts
      });
    }

    // Agregar días del mes siguiente si es necesario para completar la última semana
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 semanas * 7 días = 42
    for (let day = 1; day <= remainingDays && remainingDays < 7; day++) {
      const nextDate = new Date(this.selectedYear, this.selectedMonth, day);
      const dayShifts = this.getShiftsForDay(nextDate);

      days.push({
        date: nextDate,
        dayNumber: nextDate.getDate(),
        dayName: this.dayNames[(nextDate.getDay() + 6) % 7], // Convertir a formato Lun-Dom
        isCurrentMonth: false,
        isToday: this.isSameDay(nextDate, today),
        shifts: dayShifts
      });
    }

    return days;
  }

  private transformShiftsToCalendarFormat(): CalendarShift[] {
    let filteredShifts = this.assignedShifts;

    // Aplicar filtro de empleado si hay uno seleccionado
    if (this.selectedEmployeeId) {
      filteredShifts = this.assignedShifts.filter(shift => shift.user.id.toString() === this.selectedEmployeeId);
    }

    return filteredShifts.map(assigned => {
      const employeeName = `${assigned.user.first_name} ${assigned.user.last_name}`;
      return {
        id: assigned.id,
        employeeName,
        shiftName: assigned.shift.name,
        startTime: this.formatTime(assigned.shift.start_time),
        endTime: this.formatTime(assigned.shift.end_time),
        color: this.getColorForEmployee(employeeName)
      };
    });
  }

  private formatTime(timeString: string): string {
    // Convierte "07:30:00" a "7:30 AM"
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  private getShiftsForDay(date: Date): CalendarShift[] {
    return this.calendarShifts.filter(shift => {
      const assignedShift = this.assignedShifts.find(as => as.id === shift.id);
      if (!assignedShift) return false;

      // Validación de rango de fechas (lógica existente)
      const startDate = new Date(assignedShift.start_date);
      const endDate = new Date(assignedShift.end_date);

      // Normalizar la fecha del calendario a UTC para comparación justa
      const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const startDateUTC = new Date(
        Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
      );
      const endDateUTC = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

      const isInDateRange = dateUTC >= startDateUTC && dateUTC <= endDateUTC;

      // Nueva validación: verificar working_days usando fecha UTC normalizada
      const workingDays = assignedShift.shift.working_days || [];
      const isDayAllowed = this.isDayEnabled(dateUTC, workingDays);

      // Ambas condiciones deben cumplirse
      return isInDateRange && isDayAllowed;
    });
  }

  private getColorForEmployee(employeeName: string): string {
    // Paleta de colores más amplia y visualmente agradable
    const colors = [
      '#3B82F6', // Azul
      '#10B981', // Verde esmeralda
      '#F59E0B', // Amarillo
      '#EF4444', // Rojo
      '#8B5CF6', // Púrpura
      '#EC4899', // Rosa
      '#06B6D4', // Cian
      '#84CC16', // Lima
      '#F97316', // Naranja
      '#6366F1', // Índigo
      '#14B8A6', // Teal
      '#F43F5E', // Rosa intenso
      '#A855F7', // Violeta
      '#22C55E', // Verde
      '#FB7185', // Rosa claro
      '#60A5FA' // Azul claro
    ];

    // Generar hash consistente basado en el nombre del empleado
    let hash = 0;
    for (let i = 0; i < employeeName.length; i++) {
      hash = employeeName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Asegurar que el hash sea positivo y seleccionar color
    return colors[Math.abs(hash) % colors.length];
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Verificar si un día específico está habilitado según working_days
  private isDayEnabled(date: Date, workingDays: string[]): boolean {
    // Si no hay working_days definidos, mostrar todos los días (backward compatibility)
    if (!workingDays || workingDays.length === 0) {
      return true;
    }

    // CORREGIDO: Usar getUTCDay() para evitar problemas de zona horaria
    const dayOfWeek = date.getUTCDay();
    return workingDays.some(day => this.dayMapping[day] === dayOfWeek);
  }

  // Métodos de eventos
  onDayClick(day: CalendarDay, event: Event): void {
    if (!this.allowInteraction) return;

    const calendarEvent: CalendarEvent = {
      type: 'click',
      day,
      originalEvent: event
    };

    this.dayClick.emit(calendarEvent);
  }

  onShiftClick(shift: CalendarShift, day: CalendarDay, event: Event): void {
    if (!this.allowInteraction) return;

    event.stopPropagation(); // Evitar que se dispare también el click del día

    const calendarEvent: CalendarEvent = {
      type: 'click',
      day,
      shift,
      originalEvent: event
    };

    this.shiftClick.emit(calendarEvent);
  }

  onDayHover(day: CalendarDay, event: Event): void {
    if (!this.allowInteraction) return;

    const calendarEvent: CalendarEvent = {
      type: 'hover',
      day,
      originalEvent: event
    };

    this.dayHover.emit(calendarEvent);
  }

  onShiftHover(shift: CalendarShift, day: CalendarDay, event: Event): void {
    if (!this.allowInteraction) return;

    const calendarEvent: CalendarEvent = {
      type: 'hover',
      day,
      shift,
      originalEvent: event
    };

    this.shiftHover.emit(calendarEvent);
  }
}
