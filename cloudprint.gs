//プリンターリストを取得する
function getPrinterList() {
  //プリンターリストを取得
  var Properties = PropertiesService.getUserProperties();
  var token = Properties.getProperty("HIRO");
  var header = {
                  headers: {
                    Authorization: 'Bearer ' + token
                  },
                  muteHttpExceptions: true
               }              

  var response = UrlFetchApp.fetch('https://www.google.com/cloudprint/search', header).getContentText();
  
  //エラーコードを取得
  try{
    var Regexp = /<H2>([\s\S]*?)<\/H2>/i;
    var match = Regexp.exec(response);
    var code = match[1];
  }catch(e){
  
  }
  
  //エラーコードが返ってくる場合
  if(code == "Error 403"){
    //リフレッシュトークンでトークンを取得して、再度実行
    var ret = getNewToken();
    
    //エラー判定
    if(ret == "NG"){
        Browser.msgBox("エラーですってよ");
        return JSON.stringify(["NG",0])
    }else{
        getPrinterList();
    }
  }else{
    //プリンターリストを色々どうにかするルーチン
    var printman = JSON.parse(response);
    var prinlist = printman.printers;
    var priArray = [];
    
    //ステータスがONLINEのものだけピックアップ
    for(var i in prinlist) {
      var status = prinlist[i].connectionStatus;
      if(status == "ONLINE"){
        priArray.push([prinlist[i].name,prinlist[i].id]);
      }
    }
    
    if(priArray.length == 0){
      return JSON.stringify(["NULL",0])
    }else{
      return JSON.stringify(["OK",priArray]);
    }
  }
}

//プリント実行するメソッド
function printGoogleDocument(blobman, printerID, docName) {
  var Properties = PropertiesService.getUserProperties();
  var token = Properties.getProperty("HIRO");
  var ticket = {
    version: "1.0",
    print: {
      color: {
        type: "STANDARD_COLOR",
        vendor_id: "Color"
      },
      duplex: {
        type: "NO_DUPLEX"
      }
    }
  };

  var payload = {
    "printerid" : printerID,
    "title"     : docName,
    "content"   : blobman,
    "contentType": "application/pdf",
    "ticket"    : JSON.stringify(ticket)
  };

  var response = UrlFetchApp.fetch('https://www.google.com/cloudprint/submit', {
    method: "POST",
    payload: payload,
    headers: {
      Authorization: 'Bearer ' + token
    },
    "muteHttpExceptions": true
  });

  response = JSON.parse(response);

  if (response.success) {
    var ret = ["OK",response.message];
  } else {
    var ret = ["NG",response.errorCode + "¥n" + response.message];
  }
  
  //結果を返す
  return ret;
}

//テストプリントをする
function testprint(){
  var Properties = PropertiesService.getScriptProperties();
  var defPrinter = Properties.getProperty("myPrinter");

  var docID = "1FJ7TSGxF5NwTgztk_1Jdb3tU7KuCXcU0-B8wOH6Ero8";
  var printerid = defPrinter;
  var docName = "prinout.pdf";
  
  var blob = DriveApp.getFileById(docID).getBlob();
  
  var ret = printGoogleDocument(blob,printerid,docName);
  
  //HTML側へ結果を返す
  return JSON.stringify(ret);
}

