import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLogicComponent } from './card-logic.component';

describe('CardLogicComponent', () => {
  let component: CardLogicComponent;
  let fixture: ComponentFixture<CardLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
