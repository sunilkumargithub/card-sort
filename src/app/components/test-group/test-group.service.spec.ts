import { TestBed, inject } from '@angular/core/testing';

import { TestGroupService } from './test-group.service';

describe('TestGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestGroupService]
    });
  });

  it('should be created', inject([TestGroupService], (service: TestGroupService) => {
    expect(service).toBeTruthy();
  }));
});
