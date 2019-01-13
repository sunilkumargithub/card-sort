import { DeckModule } from './deck.module';

describe('DeckModule', () => {
  let deckModule: DeckModule;

  beforeEach(() => {
    deckModule = new DeckModule();
  });

  it('should create an instance', () => {
    expect(deckModule).toBeTruthy();
  });
});
