// --- Pengaturan.gs ---

// 1. AMBIL SEMUA DATA PENGATURAN (UNTUK DITAMPILKAN DI FORM)
function getAllPengaturan() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_pengaturan");
  const data = ws.getDataRange().getValues();
  let settings = {};
  
  // Ubah array 2D menjadi Objek {kunci: nilai}
  data.forEach(row => {
    if(row[0]) {
      settings[row[0]] = row[1];
    }
  });
  
  return settings;
}

// 2. SIMPAN PERUBAHAN KE DATABASE
function saveAllPengaturan(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_pengaturan");
  const data = ws.getDataRange().getValues();
  
  // Loop baris database, jika kuncinya ada di form, update nilainya
  for (let i = 0; i < data.length; i++) {
    let key = data[i][0];
    // Cek apakah form memiliki data untuk kunci ini
    if (form.hasOwnProperty(key)) {
      // Update kolom B (index 1)
      ws.getRange(i + 1, 2).setValue(form[key]);
    }
  }
  
  return "Pengaturan Berhasil Disimpan!";
}
