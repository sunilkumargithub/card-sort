import { TestGroupModule } from './test-group.module';

describe('TestGroupModule', () => {
  let testGroupModule: TestGroupModule;

  beforeEach(() => {
    testGroupModule = new TestGroupModule();
  });

  it('should create an instance', () => {
    expect(testGroupModule).toBeTruthy();
  });
});
