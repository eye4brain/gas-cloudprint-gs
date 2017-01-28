var prop = PropertiesService.getScriptProperties();
var CLIENT_ID = prop.getProperty("oauthclient");
var CLIENT_SECRET=prop.getProperty("oauthsecret");
var REDIRECT_URL =prop.getProperty("oauthurl");

var AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/auth'; 
var TOKEN_URL = 'https://accounts.google.com/o/oauth2/token'; 

var tokenPropertyName = 'GOOGLE_OAUTH_TOKEN'; 
var baseURLPropertyName = 'GOOGLE_INSTANCE_URL'; 

//認証作業画面のメインウィンドウ
function doGet(e) {
  if(e.parameters.code){
    //取得完了画面の出力
    getAndStoreAccessToken(e.parameters.code);
    var output = HtmlService.createTemplateFromFile('finish');
    var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    return html;
  }
}

//認証用URLの出力
function getURLForAuthorization(){
  return AUTHORIZE_URL + '?response_type=code&client_id='+CLIENT_ID+'&redirect_uri='+REDIRECT_URL
                       + '&scope=openid%20email%20https://www.googleapis.com/auth/cloudprint%20profile&https://docs.google.com/feeds'
                       + '&access_type=offline&approval_prompt=force';
}

//OAuth2のアクセストークンを取得する
function getAndStoreAccessToken(code){
  var parameters = {
     method : 'post',
     payload : 'client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&grant_type=authorization_code&redirect_uri='+REDIRECT_URL+'&code=' + code
     };
  
  var response = UrlFetchApp.fetch(TOKEN_URL,parameters).getContentText();   
  var tokenResponse = JSON.parse(response);
  var token = tokenResponse["access_token"];
  var reftoken = tokenResponse["refresh_token"];
  
  //ユーザプロパティに格納
  var Properties = PropertiesService.getUserProperties();
  Properties.setProperty("HIRO", token);
  Properties.setProperty("refresh", reftoken);
}

//アクセストークンをリセット
function resetToken(){
  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch("https://accounts.google.com/o/oauth2/revoke?token="  + token).getContentText();   
  var tokenResponse = JSON.parse(response); 
}

//OAuth2のTokenが取得できてるかどうかのチェック
function isTokenValid() {
  var token = ScriptApp.getOAuthToken();
  if(!token){ //if its empty or undefined
    return false;
  }
  return true; //naive check
}


//ログインユーザのメールアドレスを取得する
function GetUser() {
  var objUser = Session.getActiveUser().getEmail();
  return objUser;
}

//取得済みAccess Tokenが死んでるかどうかをチェック
function tokencheck(){
  var Properties = PropertiesService.getUserProperties();
  var token = Properties.getProperty("HIRO");
  
  //tokeninfoになげてチェック
  var url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token;
  var fetch = UrlFetchApp.fetch(url);
  var json = JSON.parse(fetch);
  
  try{
    var ret = ret.error;
    var check = "NG";
  }catch(e){
    var check = "OK";
  }
  
  //判定結果を返す
  return check;
}

//リフレッシュトークンを使って新しいAccess Tokenを取得する
function getNewToken(){
  //リフレッシュトークンを取得
  var Properties = PropertiesService.getUserProperties();
  var rToken = Properties.getProperty("refresh");
  
  //POSTを組み立てる
  var parameters = {
     method : 'post',
     payload : 'client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&grant_type=refresh_token&refresh_token='+rToken
     };
  
  //リフレッシュの実行とAccess Tokenの取得
  try{
    var response = UrlFetchApp.fetch(TOKEN_URL,parameters).getContentText();   
    var tokenResponse = JSON.parse(response);
    var token = tokenResponse["access_token"];
  
    //新しく取得したAccess Tokenを格納
    Properties.setProperty("HIRO", token);
    return "OK";
  }catch(e){
    return "NG";
  }
}