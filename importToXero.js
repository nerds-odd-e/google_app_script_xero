var spreadSheetId = UserProperties.getProperty('importSpreadSheetId');
function main() {
  if (XeroOAuth.setup() && spreadSheetId) {
    importInvoiceFromSpreadsheet();
  } else {
    Logger.log('Please run the XeroOAuth.setup()');
  }
}

function importInvoiceFromSpreadsheet() {
  var spreadsheet = SpreadsheetApp.openById(spreadSheetId);
  var sheet1 = spreadsheet.getSheets()[0];
  // get the 1st row (frozen) , the header
  var dataRange = sheet1.getRange(1, 1, sheet1.getLastRow(), sheet1.getLastColumn());
  var dataObjects = getRowsData(sheet1, dataRange, 1);
  
  var invoices = XmlService.createElement('Invoices');

  for(var i = 0; i < dataObjects.length; i++) {
    // skip 1st data row because it is a header row
    if(i === 0 || dataObjects[i].invoiceNumber === null || dataObjects[i].invoiceNumber === undefined) {
      continue;
    }
    var invoice = XmlService.createElement('Invoice');
    invoice.addContent(XmlService.createElement('Type').setText('ACCREC'));
    invoice.addContent(XmlService.createElement('InvoiceNumber').setText(dataObjects[i].invoiceNumber));
    invoice.addContent(XmlService.createElement('LineAmountTypes').setText('NoTax'));
    invoice.addContent(XmlService.createElement('CurrencyCode').setText(dataObjects[i].currency)); 
    invoice.addContent(XmlService.createElement('Status').setText('DRAFT'));
    invoice.addContent(XmlService.createElement('Date').setText(dataObjects[i].date.replace(/\./g,'-')));
    
    createContact(dataObjects[i].to, invoice);
    
    createLineItems(dataObjects[i], invoice);
    
    invoices.addContent(invoice);
  };

  var xmlDocument = XmlService.createDocument(invoices);
  
  var urlOptions = XeroOAuth.oauthOptions;
  urlOptions.method = 'post';
  urlOptions.payload = XmlService.getRawFormat().format(xmlDocument);
  urlOptions.contentType = 'application/xml; charset=utf-8';
  var url = 'https://api.xero.com/api.xro/2.0/Invoices';
  var response = UrlFetchApp.fetch(url, urlOptions).getContentText();
  Logger.log(response);
}

function createContact(contactData, invoice) {
  var lines = contactData.split('\n');
  
  if(lines === null || lines === undefined || lines.length === 0) {
    return;
  }
  var contact = XmlService.createElement('Contact');
  contact.addContent(XmlService.createElement('Name').setText(lines[0]));
  
  invoice.addContent(contact);
  return;
}

function createLineItems(dataObject, invoice) {
  if((dataObject.entry1 === null || dataObject.entry1 === undefined) && 
     (dataObject.entry2 === null || dataObject.entry2 === undefined) && 
     (dataObject.entry3 === null || dataObject.entry3 === undefined) &&
     (dataObject.entry4 === null || dataObject.entry4 === undefined)) {
       return;
     }
  var lineItems = XmlService.createElement('LineItems');
  for(var i = 1; i < 5; i++) {
    var entryKey = 'entry' + i;
    var amountKey = 'amount' + i;
    if(dataObject[entryKey] !== null && dataObject[entryKey] !== undefined){
      var lineItem = XmlService.createElement('LineItem');
      lineItem.addContent(XmlService.createElement('Description').setText(dataObject[entryKey]));
      lineItem.addContent(XmlService.createElement('Quantity').setText(1));
      lineItem.addContent(XmlService.createElement('UnitAmount').setText(dataObject[amountKey]));
      lineItem.addContent(XmlService.createElement('AccountCode').setText(200));
      lineItems.addContent(lineItem);
    }
  }
  invoice.addContent(lineItems);
  return; 
}