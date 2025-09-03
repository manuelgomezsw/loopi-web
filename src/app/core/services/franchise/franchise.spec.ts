import { TestBed } from '@angular/core/testing';

import { Franchise } from './franchise';

describe('Franchise', () => {
  let service: Franchise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Franchise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
