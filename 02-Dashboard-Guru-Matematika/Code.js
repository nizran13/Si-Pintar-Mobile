// Nama Sheet harus tepat
var SHEET_DATA = "DataNilai";

function doGet(e) {
  // Mengambil parameter nama guru dari URL jika ada (dikirim dari login)
  var namaGuru = e.parameter.nama || "Guru";
  
  var tmp = HtmlService.createTemplateFromFile('Index');
  tmp.namaGuru = namaGuru; // Mengirim variabel ke HTML
  
  return tmp.evaluate()
    .setTitle("Dashboard Guru - Matematika")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fungsi untuk mengambil data nilai siswa ke dashboard
function getSiswaData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATA);
  var data = sheet.getDataRange().getValues();
  
  // Menghilangkan baris header dan mengirim data
  data.shift(); 
  return data;
}

// Fungsi jika nanti Android ingin mengambil data via JSON
function doPost(e) {
  var data = getSiswaData();
  return ContentService.createTextOutput(JSON.stringify(data))
         .setMimeType(ContentService.MimeType.JSON);
}
