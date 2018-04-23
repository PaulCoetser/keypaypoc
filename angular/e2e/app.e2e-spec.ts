import { AccountingKeyPayIntegrationPOCTemplatePage } from './app.po';

describe('AccountingKeyPayIntegrationPOC App', function() {
  let page: AccountingKeyPayIntegrationPOCTemplatePage;

  beforeEach(() => {
    page = new AccountingKeyPayIntegrationPOCTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
