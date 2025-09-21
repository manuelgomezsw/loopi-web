export interface CalendarDay {
  date: Date;
  dayNumber: number;
  dayName: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  shifts: CalendarShift[];
}

export interface CalendarShift {
  id: number;
  employeeName: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface CalendarEvent {
  type: 'click' | 'hover' | 'doubleClick';
  day: CalendarDay;
  shift?: CalendarShift;
  originalEvent: Event;
}
