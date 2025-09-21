import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarViewComponent } from './calendar-view.component';

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate calendar days for current month', () => {
    component.selectedMonth = 9;
    component.selectedYear = 2025;
    component.ngOnInit();

    expect(component.calendarDays.length).toBeGreaterThan(0);
    expect(component.monthName).toBe('Septiembre 2025');
  });

  it('should transform assigned shifts to calendar format', () => {
    const mockAssignedShifts = [
      {
        id: 1,
        user: { id: 1, first_name: 'Juan', last_name: 'Pérez' },
        shift: { id: 1, name: 'Apertura', start_time: '08:00', end_time: '16:00' },
        start_date: '2025-09-01T00:00:00Z',
        end_date: '2025-09-30T00:00:00Z',
        is_active: true,
        created_at: '',
        updated_at: '',
        user_id: 1,
        shift_id: 1
      }
    ];

    component.assignedShifts = mockAssignedShifts;
    component.ngOnInit();

    expect(component.calendarShifts.length).toBe(1);
    expect(component.calendarShifts[0].employeeName).toBe('Juan Pérez');
    expect(component.calendarShifts[0].shiftName).toBe('Apertura');
  });
});
