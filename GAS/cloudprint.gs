//セット済みプリンターを取得
function getSetPrinter(){
  var service = checkOAuth();
  if (service.hasAccess()) {
    var Properties = PropertiesService.getScriptProperties();
    var myPrin = Properties.getProperty("myPrinter");
  
    if(myPrin == null){
      return "NO";
    }else{
      return myPrin;
    }
  }else{
    //エラーを返す（認証が実行されていない場合）
    return "error";
  }
}

//プリンターリストを取得する
function getPrinterList() {
  var service = checkOAuth();
  if (service.hasAccess()) {
    //プリンターリストを取得
    var header = {
                    headers: {
                      Authorization: 'Bearer ' + service.getAccessToken()
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
      Logger.log(e.message);
    }
    
    //エラーコードが返ってくる場合
    if(code == "Error 403"){
      //リフレッシュトークンでトークンを取得して、再度実行
      checkOAuth();
      getPrinterList();
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
  
  }else{
    //エラーを返す（認証が実行されていない場合）
    return "error";
  }
}

//デフォルトプリンタにセット
function setDefPrinter(value){
  var Properties = PropertiesService.getScriptProperties();
  Properties.setProperty("myPrinter", value);
  return "OK";
}

//テストプリントをする
function testprint(){
  var Properties = PropertiesService.getScriptProperties();
  var defPrinter = Properties.getProperty("myPrinter");
  var mysheet = Properties.getProperty("mysheetid");

  var docID = mysheet;
  var printerid = defPrinter;
  var docName = "prinout.pdf";
  
  var blob = DriveApp.getFileById(docID).getBlob();
  
  var ret = printGoogleDocument(blob,printerid,docName);
  
  //HTML側へ結果を返す
  return JSON.stringify(ret);
}

//プリント実行するメソッド
function printGoogleDocument(blobman, printerID, docName) {
  var service = checkOAuth();
  if (service.hasAccess()) {
    //プリンター設定
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
    
    //プリント情報を構築する
    var payload = {
      "printerid" : printerID,
      "title"     : docName,
      "content"   : blobman,
      "contentType": "application/pdf",     //今回はPDFのMIMETYPEを指定
      "ticket"    : JSON.stringify(ticket)
    };
    
    //CloudPrintに送信
    var response = UrlFetchApp.fetch('https://www.google.com/cloudprint/submit', {
      method: "POST",
      payload: payload,
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      },
      "muteHttpExceptions": true
    });
    
    //送信結果を受け取る
    response = JSON.parse(response);
    
    //結果を分析する
    if (response.success) {
      var ret = ["OK",response.message];
    } else {
      var ret = ["NG",response.errorCode + "¥n" + response.message];
    }
    
    //結果を返す
    return ret;

  }else{
    //エラーを返す（認証が実行されていない場合）
    return "error";
  }
}
