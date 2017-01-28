//コールバック待ち
function setbackurl(){
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.getProperty("oauthurl");
  
  if(spfile == null){
    return "未選択";
  }
  
  if(spfile != undefined){
  }else{
    spfile = "未選択";
  }

  return spfile;
}

//コールバック待ち
function setclienid(){
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.getProperty("oauthclient");
  
  if(spfile == null){
    return "未選択";
  }
  
  if(spfile != undefined){
  }else{
    spfile = "未選択";
  }
  
  return spfile;
}

//コールバック待ち
function setSecret(){
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.getProperty("oauthsecret");
  
  if(spfile == null){
    return "未選択";
  }
  
  if(spfile != undefined){
  }else{
    spfile = "未選択";
  }
  
  return spfile;
}

//コールバック待ち
function domainurl(){
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.getProperty("domain");
  
  if(spfile == null){
    return "未選択";
  }
  
  if(spfile != undefined){
  }else{
    spfile = "未選択";
  }
  
  return spfile;
}

//OAuth2認証コールバックURLの入力
function oauthcallback(){
  var ui = SpreadsheetApp.getUi();
  var Properties = PropertiesService.getScriptProperties();
  var tomail = Properties.getProperty("oauthurl");
  var re = ui.prompt("OAuth認証用コールバックURLを入力してください。\n現在設定されているURLは【" + tomail + "】です。", 
      ui.ButtonSet.OK_CANCEL);
  switch(re.getSelectedButton()){
    case ui.Button.OK:
      var str = re.getResponseText();
      Properties.setProperty('oauthurl',str);
      ui.alert(str + "で設定されました。");
      break;
    case ui.Button.CANCEL:
      ui.alert("設定はキャンセルされました。");
      break;
    case ui.Button.CLOSE:
      break;
  }
  
  openSidebar();
}

//クライアントIDの入力
function oauthclientid(){
  var ui = SpreadsheetApp.getUi();
  var Properties = PropertiesService.getScriptProperties();
  var tomail = Properties.getProperty("oauthclient");
  var re = ui.prompt("OAuth認証クライアントIDを入力してください。\n現在設定されているIDは【" + tomail + "】です。", 
      ui.ButtonSet.OK_CANCEL);
  switch(re.getSelectedButton()){
    case ui.Button.OK:
      var str = re.getResponseText();
      Properties.setProperty('oauthclient',str);
      ui.alert(str + "で設定されました。");
      break;
    case ui.Button.CANCEL:
      ui.alert("設定はキャンセルされました。");
      break;
    case ui.Button.CLOSE:
      break;
  }
  
  openSidebar();
}


//クライアントIDの入力
function oauthSecret(){
  var ui = SpreadsheetApp.getUi();
  var Properties = PropertiesService.getScriptProperties();
  var tomail = Properties.getProperty("oauthsecret");
  var re = ui.prompt("OAuth認証クライアントシークレットを入力してください。\n現在設定されているコードは【" + tomail + "】です。", 
      ui.ButtonSet.OK_CANCEL);
  switch(re.getSelectedButton()){
    case ui.Button.OK:
      var str = re.getResponseText();
      Properties.setProperty('oauthsecret',str);
      ui.alert(str + "で設定されました。");
      break;
    case ui.Button.CANCEL:
      ui.alert("設定はキャンセルされました。");
      break;
    case ui.Button.CLOSE:
      break;
  }
  
  openSidebar();
}

//ドメインの入力
function setDomain(){
  var ui = SpreadsheetApp.getUi();
  var Properties = PropertiesService.getScriptProperties();
  var tomail = Properties.getProperty("domain");
  var re = ui.prompt("ドメインを入力してください。\n現在設定されているドメインは【" + tomail + "】です。", 
      ui.ButtonSet.OK_CANCEL);
  switch(re.getSelectedButton()){
    case ui.Button.OK:
      var str = re.getResponseText();
      Properties.setProperty('domain',str);
      ui.alert(str + "で設定されました。");
      break;
    case ui.Button.CANCEL:
      ui.alert("設定はキャンセルされました。");
      break;
    case ui.Button.CLOSE:
      break;
  }
  
  openSidebar();
}
