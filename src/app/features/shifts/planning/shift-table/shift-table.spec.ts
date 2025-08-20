import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTable } from './shift-table';

describe('ShiftTable', () => {
  let component: ShiftTable;
  let fixture: ComponentFixture<ShiftTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
