var consumerKey = UserProperties.getProperty('xeroConsumerKey'); 
var consumerSecret = UserProperties.getProperty('xeroConsumerSecret'); 
var spreadSheetId = UserProperties.getProperty('spreadSheetId');

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
  
function main() {
  if (consumerKey && consumerSecret && spreadSheetId) {
    fetchingInvoices();
  }
}

function fetchingOrgInfo() {
  Logger.log('Access organisation starts');
  var url = 'https://api.xero.com/api.xro/2.0/Organisation';
  var response = UrlFetchApp.fetch(url, oauthOptions).getContentText();
  var document = XmlService.parse(response);
  var xml = XmlService.getPrettyFormat().format(document);
  Logger.log('Ended with response \n' + xml);
}

function fetchingInvoices() {
  Logger.log('Access invoices starts');
  var url = 'https://api.xero.com/api.xro/2.0/Invoices';
  var response = UrlFetchApp.fetch(url, oauthOptions).getContentText();
  var document = XmlService.parse(response);
  var xml = XmlService.getPrettyFormat().format(document);
  Logger.log('Ended with response \n' + xml);
}

function populateSpreadsheetWithInvoices(xml) {
  SpreadsheetApp.ope
  var spreadsheet = SpreadsheetApp.openById(spreadSheetId);
  var sheet1 = spreadsheet.getSheets()[0];
  sheet1.getRange(1, 1, 2, 2).setValues([ [ 'One', 'Two' ], [ 1, 2 ] ]);
}
