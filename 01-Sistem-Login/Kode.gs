// Nama Sheet harus tepat (Case-Sensitive)
var SHEET_NAME = "Users";

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle("Si-Pintar Login")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fungsi utama untuk validasi login
function checkLogin(username, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    // Cek Username & Password
    if (data[i][0] == username && data[i][1] == password) {
      
      // Ambil data lengkap (Sesuai urutan kolom baru)
      return {
        status: "success",
        nama: data[i][2],
        url: data[i][3],
        fotoId: data[i][4],  // Kolom E (ID Foto)
        nip: data[i][5],     // Kolom F
        pangkat: data[i][6], // Kolom G
        mapel: data[i][7]    // Kolom H
      };
    }
  }
  return { status: "failed", message: "Username atau Password Salah!" };
}

// Fungsi agar script bisa dipanggil oleh Aplikasi Android (API Mode)
function doPost(e) {
  var action = e.parameter.action;
  if (action == "login") {
    var res = checkLogin(e.parameter.username, e.parameter.password);
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
  }
}
