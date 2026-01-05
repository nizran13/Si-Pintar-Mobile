// --- Kode.gs (FINAL FIXED) ---

var SHEET_DATA = "DataNilai"; 

function doGet(e) {
  var namaGuru = (e && e.parameter && e.parameter.nama) ? e.parameter.nama : "Guru";
  var fotoId = (e && e.parameter && e.parameter.foto) ? e.parameter.foto : ""; 

  var template = HtmlService.createTemplateFromFile('Index');
  template.namaGuru = namaGuru; 
  template.fotoId = fotoId; 
  
  return template.evaluate()
    .setTitle("Dashboard Guru - Si Pintar")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// FUNGSI BACA DATABASE PENGATURAN (SUDAH DISESUAIKAN DENGAN SCREENSHOT)
function getInfoSekolah() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_pengaturan");
  
  // Nilai Default (Jaga-jaga jika database kosong/error)
  const result = {
    sekolah: "SMP Negeri...", 
    mapel: "Matematika", 
    guru: "Nama Guru...", 
    nip: "...", 
    kepsek: "Nama Kepsek...", 
    nip_kepsek: "...", 
    kota: "Kotamobagu", 
    tahun: "2025/2026" // Default biar gak undefined
  };
  
  if (ws) {
    const data = ws.getDataRange().getValues();
    data.forEach(row => {
      if (row[0]) {
        const key = row[0].toString().toLowerCase().trim(); // Bersihkan spasi
        const val = row[1];
        
        // Pencocokan Key Eksak sesuai Screenshot db_pengaturan
        if(key.includes("nama_sekolah")) result.sekolah = val;
        if(key.includes("mata_pelajaran")) result.mapel = val;
        if(key.includes("nama_guru")) result.guru = val;
        if(key.includes("nip_guru")) result.nip = val;
        if(key.includes("kepala_sekolah")) result.kepsek = val;
        if(key.includes("nip_kepsek")) result.nip_kepsek = val;
        if(key.includes("kota_sekolah")) result.kota = val;
        if(key.includes("tahun_pelajaran")) result.tahun = val; 
      }
    });
  }
  return result;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Fungsi Legacy (Penunjang Android Lama)
function getSiswaData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATA);
  if (!sheet) return []; 
  var data = sheet.getDataRange().getValues();
  data.shift(); 
  return data;
}

function doPost(e) {
  var data = getSiswaData();
  return ContentService.createTextOutput(JSON.stringify(data))
         .setMimeType(ContentService.MimeType.JSON);
}
