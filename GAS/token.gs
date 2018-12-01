//認証用各種変数
var tokenurl = "https://accounts.google.com/o/oauth2/token"
var authurl = "https://accounts.google.com/o/oauth2/auth"
var clientid = '930179472599-0g20ng45sa681ni7fbon30rcqo6b1orj.apps.googleusercontent.com';
var clientsecret='MOkKhOJnwtSTj1P92MNnhOcY';
var scope = "https://www.googleapis.com/auth/cloudprint"

function startoauth(){
  //UIを取得する
  var ui = SpreadsheetApp.getUi();
  
  //認証済みかチェックする
  var service = checkOAuth();
  if (!service.hasAccess()) {
    //認証画面を出力
    var output = HtmlService.createHtmlOutputFromFile('template').setHeight(310).setWidth(500).setSandboxMode(HtmlService.SandboxMode.IFRAME);
    ui.showModalDialog(output, 'OAuth2.0認証');
  } else {
    //認証済みなので終了する
    ui.alert("すでに認証済みです。");
  }
}

//アクセストークンURLを含んだHTMLを返す関数
function authpage(){
  var service = checkOAuth();
  var authorizationUrl = service.getAuthorizationUrl();
  var html = "<center><b><a href='" + authorizationUrl + "' target='_blank' onclick='closeMe();'>アクセス承認</a></b></center>"
  return html;
}

//認証チェック
function checkOAuth() {
  return OAuth2.createService("CloudPrint")
    .setAuthorizationBaseUrl(authurl)
    .setTokenUrl(tokenurl)
    .setClientId(clientid)
    .setClientSecret(clientsecret)
    .setCallbackFunction("authCallback")　//認証を受けたら受け取る関数を指定する
    .setPropertyStore(PropertiesService.getScriptProperties())  //スクリプトプロパティに保存する
    .setScope(scope)
    .setParam('login_hint', Session.getActiveUser().getEmail())
    .setParam('access_type', 'offline')
    .setParam('approval_prompt', 'force');
}

//認証コールバック
function authCallback(request) {
  var service = checkOAuth();
  Logger.log(request);
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput("認証に成功しました。ページを閉じてください。");
  } else {
    return HtmlService.createHtmlOutput("認証に失敗しました。");
  }
}

//ログアウト
function reset() {
  checkOAuth().reset();
  SpreadsheetApp.getUi().alert("ログアウトしました。")
}