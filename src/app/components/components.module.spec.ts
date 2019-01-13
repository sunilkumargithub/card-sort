import { ComponentsModule } from './components.module';

describe('ComponentsModule', () => {
  let componentsModule: ComponentsModule;

  beforeEach(() => {
    componentsModule = new ComponentsModule();
  });

  it('should create an pages module instance', () => {
    expect(componentsModule).toBeTruthy();
  });
});
