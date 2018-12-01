function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('▶セッティング')
    .addItem('印刷設定', 'openSidebar')
    .addItem('OAuth認証実行', 'startoauth')
    .addToUi();
    
    //シートのIDを取得する
    getMySheetId();
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
