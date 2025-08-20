import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusSelect } from './status-select';

describe('StatusSelect', () => {
  let component: StatusSelect;
  let fixture: ComponentFixture<StatusSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
