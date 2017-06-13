import { RxjsSamplesPage } from './app.po';

describe('rxjs-samples App', () => {
  let page: RxjsSamplesPage;

  beforeEach(() => {
    page = new RxjsSamplesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
