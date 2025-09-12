import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkContextSelector } from './work-context-selector';

describe('WorkContextSelector', () => {
  let component: WorkContextSelector;
  let fixture: ComponentFixture<WorkContextSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkContextSelector]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkContextSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
