import { TestBed, inject } from '@angular/core/testing';

import { DrawerService } from './drawer.service';

describe('DrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawerService]
    });
  });

  it('should be created', inject([DrawerService], (service: DrawerService) => {
    expect(service).toBeTruthy();
  }));
});
