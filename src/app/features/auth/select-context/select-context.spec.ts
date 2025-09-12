import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContext } from './select-context';

describe('SelectContext', () => {
  let component: SelectContext;
  let fixture: ComponentFixture<SelectContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectContext]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
