import { TestBed } from '@angular/core/testing';

import { WorkContext } from './work-context';

describe('WorkContext', () => {
  let service: WorkContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
