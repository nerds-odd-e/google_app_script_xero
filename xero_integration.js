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
  } else {
    Logger.log('Please set xeroConsumerKey, xeroConsumerSecret and spreadSheetId');
  }
}

function fetchingInvoices() {
  Logger.log('Access invoices starts');
  var url = 'https://api.xero.com/api.xro/2.0/Invoices';
  var response = UrlFetchApp.fetch(url, oauthOptions).getContentText();
  var document = XmlService.parse(response);
  Logger.log('Access invoices ends');
  populateSpreadsheetWithInvoices(document);
}

function populateSpreadsheetWithInvoices(xmlDocument) {
  var spreadsheet = SpreadsheetApp.openById(spreadSheetId);
  var sheet1 = spreadsheet.getSheets()[0];

  var root = xmlDocument.getRootElement();
  var docId = root.getChildText('Id'); 
  var resStatus = root.getChildText('Status');
  if (resStatus === 'OK') {
    Logger.log('Doc Id ' + docId);
    var invoices = root.getChild('Invoices').getChildren();
    // create spreadsheet header
    for (var i = 0; i < invoices.length; i++) {
      if (i === 0) {
        populateSpreadsheetHeader(sheet1, invoices[i].getChildren());
      };
      populateSpreadsheetRow(sheet1, invoices[i].getChildren(), i+1);
    };
  }
}

function populateSpreadsheetRow(sheet, columns, rowIndex) {
  var columnValue = []; 
  for (var i = 0; i < columns.length; i++) {
    columnValue.push(columns[i].getText());
  }
  sheet.getRange(rowIndex + 1, 1, 1, columns.length).setValues([ columnValue ]);
}

function populateSpreadsheetHeader(sheet, headers) {
  var column = []; 
  for (var i = 0; i < headers.length; i++) {
    column.push(headers[i].getName());
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([ column ]);
}
