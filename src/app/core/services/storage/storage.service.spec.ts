import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { APP_CONFIG } from '../../app.config';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          StorageService,
          { provide: APP_CONFIG, useValue: {} }
        ]
    });
  });

  it('should be created storage service', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));
});
