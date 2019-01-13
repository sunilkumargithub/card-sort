import { ServiceModule } from '.';

describe('PagesModule', () => {
  let pagesModule: ServiceModule;

  beforeEach(() => {
    pagesModule = new ServiceModule();
  });

  it('should create an service module instance', () => {
    expect(pagesModule).toBeTruthy();
  });
});
