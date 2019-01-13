import { DashboardModule } from './dashboard.module';

describe('CardModule', () => {
  let cardModule: DashboardModule;

  beforeEach(() => {
    cardModule = new DashboardModule();
  });

  it('should create an instance', () => {
    expect(DashboardModule).toBeTruthy();
  });
});
