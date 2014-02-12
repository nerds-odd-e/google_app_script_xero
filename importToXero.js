var consumerKey = UserProperties.getProperty('xeroConsumerKey'); 
var consumerSecret = UserProperties.getProperty('xeroConsumerSecret'); 

var oauthConfig = UrlFetchApp.addOAuthService('xero');
oauthConfig.setAccessTokenUrl(
    'https://api.xero.com/oauth/AccessToken');
oauthConfig.setRequestTokenUrl(
    'https://api.xero.com/oauth/RequestToken');
oauthConfig.setAuthorizationUrl(
    'https://api.xero.com/oauth/Authorize');
oauthConfig.setConsumerKey(consumerKey);
oauthConfig.setConsumerSecret(consumerSecret);

var oauthOptions = {
  'oAuthServiceName' : 'xero',
  'oAuthUseToken' : 'always'
};

var spreadSheetId = UserProperties.getProperty('importSpreadSheetId');
function main() {
  importInvoiceFromSpreadsheet();
}

function importInvoiceFromSpreadsheet() {
//  var spreadsheet = SpreadsheetApp.openById(spreadSheetId);
//  var sheet1 = spreadsheet.getSheets()[0];
  var data = '<Invoices> \
  <Invoice> \
    <Type>ACCREC</Type> \
    <Contact> \
      <Name>Lai Kin Wah</Name> \
    </Contact> \
    <Date>2014-02-12T00:00:00</Date> \
    <DueDate>2014-02-19T00:00:00</DueDate> \
    <LineAmountTypes>Exclusive</LineAmountTypes> \
    <LineItems> \
      <LineItem> \
        <Description>Monthly rental for property at 56a Wilkins Avenue</Description> \
        <Quantity>4.3400</Quantity> \
        <UnitAmount>395.00</UnitAmount> \
        <AccountCode>200</AccountCode> \
      </LineItem> \
    </LineItems> \
  </Invoice> \
</Invoices>'
  var urlOptions = oauthOptions;
  urlOptions.method = 'post';
  urlOptions.payload = data;
  urlOptions.contentType = 'application/xml; charset=utf-8';
  var url = 'https://api.xero.com/api.xro/2.0/Invoices';
  var response = UrlFetchApp.fetch(url, oauthOptions).getContentText();
  Logger.log(response);
}