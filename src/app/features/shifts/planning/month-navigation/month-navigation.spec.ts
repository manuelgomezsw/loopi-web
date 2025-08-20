import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthNavigation } from './month-navigation';

describe('MonthNavigation', () => {
  let component: MonthNavigation;
  let fixture: ComponentFixture<MonthNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
