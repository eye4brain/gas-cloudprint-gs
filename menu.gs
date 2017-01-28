function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('▶セッティング')
    .addItem('PDF作成設定', 'openSidebar')
    .addToUi();
    
    //シートのIDを取得する
    getMySheetId();
  
  　//サイドバーを表示
    openSidebar();
}

//PDF作成用コンソールをsidebarで表示する
function openSidebar() {
  var ui = SpreadsheetApp.getUi();
  var html = HtmlService.createHtmlOutputFromFile('sidebar').setTitle('PDF作成設定').setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showSidebar(html);
} 

//自分自身のIDを取得するコード
function getMySheetId(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var myid = sheet.getId();

  var Properties = PropertiesService.getScriptProperties();
  
  Properties.setProperty("mysheetid", myid);
  
  return myid;

}

function getOAuthToken() {
  //DriveApp.getRootFolder();　//なにげにこの部分重要！！
  DriveApp.getRootFolder()
  return ScriptApp.getOAuthT;oken();
}

//アクセストークンURLを含んだHTMLを返す関数
function authpage(){
  var tokenurl =  getURLForAuthorization();
  var html = "<center><b><a href='" + tokenurl + "' target='_blank' onclick='closeMe();'>アクセス承認</a></b></center>"
  return html;
}

function startoauth(){
  var ui = SpreadsheetApp.getUi();
  
  //強制的にアクセストークンプロパティを削除する
  //UserProperties.deleteProperty(tokenPropertyName);
  
  //認証画面を出力
  var output = HtmlService.createHtmlOutputFromFile('template').setHeight(310).setWidth(500).setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showModalDialog(output, 'OAuth2.0認証');
}

function testpdf() {   
  //PDF化するシートのIDを取得する
  var Properties = PropertiesService.getScriptProperties();
  var ssid = Properties.getProperty("mysheetid");
  var ui = SpreadsheetApp.getUi();
  var token = ScriptApp.getOAuthToken();
  var newFileId = ssid;
  
  //ドメインの有無でURLを変更
  var domain = Properties.getProperty("domain");
  if(domain == ""){
    var url = "https://docs.google.com/spreadsheets/d/" + newFileId + "/export?format=pdf&portrait=true&size=A4&gridlines=false&fitw=true"
  }else{
    var url = "https://docs.google.com/a/" + domain + "/spreadsheets/d/"+newFileId+"/export?format=pdf&portrait=false&size=A4&gridlines=false&fitw=true";
  }
  
  //PDF生成するURLをfetchする
  var pdf = UrlFetchApp.fetch(url, {headers: {'Authorization': 'Bearer ' +  token}}).getBlob().setName("test" + ".pdf");
    
  //作成したPDFファイルをメールに添付して送る
  var mail = GetUser();
  var subject = 'PDF送るよ'
  var body = 'テストPDFの送信'
  MailApp.sendEmail(mail, subject, body, {attachments:pdf});
  
  ui.alert("画像PDFが送信されました。")

}


//セット済みプリンターを取得
function getSetPrinter(){
  var Properties = PropertiesService.getScriptProperties();
  var myPrin = Properties.getProperty("myPrinter");

  if(myPrin == null){
    return "NO";
  }else{
    return myPrin;
  }
}

//デフォルトプリンタにセット
function setDefPrinter(value){
  var Properties = PropertiesService.getScriptProperties();
  Properties.setProperty("myPrinter", value);
  return "OK";
}
