import { TestBed, inject } from '@angular/core/testing';

import { CardLogicService } from './card-logic.service';

describe('CardLogicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardLogicService]
    });
  });

  it('should be created', inject([CardLogicService], (service: CardLogicService) => {
    expect(service).toBeTruthy();
  }));
});
