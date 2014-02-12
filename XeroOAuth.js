/**
  * To test how to link multiple projects in Google App Script
  */
var consumerKey = UserProperties.getProperty('xeroConsumerKey'); 
var consumerSecret = UserProperties.getProperty('xeroConsumerSecret'); 

var oauthOptions = {
  'oAuthServiceName' : 'xero',
  'oAuthUseToken' : 'always'
};

function setup() {
  if (consumerKey && consumerSecret) {
    var oauthConfig = UrlFetchApp.addOAuthService('xero');
    oauthConfig.setAccessTokenUrl(
      'https://api.xero.com/oauth/AccessToken');
    oauthConfig.setRequestTokenUrl(
      'https://api.xero.com/oauth/RequestToken');
    oauthConfig.setAuthorizationUrl(
      'https://api.xero.com/oauth/Authorize');
    oauthConfig.setConsumerKey(consumerKey);
    oauthConfig.setConsumerSecret(consumerSecret);
    return true;
  }
  return false;
}