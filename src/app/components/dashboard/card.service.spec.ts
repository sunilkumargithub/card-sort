import { TestBed, inject } from '@angular/core/testing';

import { CardService } from './dashboard.service';

describe('CardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardService]
    });
  });

  it('should be created', inject([CardService], (service: CardService) => {
    expect(service).toBeTruthy();
  }));
});
