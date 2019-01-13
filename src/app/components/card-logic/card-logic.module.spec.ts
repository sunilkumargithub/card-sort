import { CardLogicModule } from './card-logic.module';

describe('CardLogicModule', () => {
  let cardLogicModule: CardLogicModule;

  beforeEach(() => {
    cardLogicModule = new CardLogicModule();
  });

  it('should create an instance', () => {
    expect(cardLogicModule).toBeTruthy();
  });
});
