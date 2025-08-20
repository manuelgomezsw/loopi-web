import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursCalculation } from './hours-calculation';

describe('HoursCalculation', () => {
  let component: HoursCalculation;
  let fixture: ComponentFixture<HoursCalculation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoursCalculation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursCalculation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
