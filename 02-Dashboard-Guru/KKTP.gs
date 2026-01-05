// --- KKTP.gs ---

// 1. SIMPAN KKTP
function simpanKKTP(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_kktp");
  if (!ws) return "Error: Database db_kktp tidak ditemukan!";
  
  ws.appendRow([
    ws.getLastRow(), 
    data.fase, 
    data.kelas, 
    data.semester, 
    data.bab, 
    data.alur, 
    data.materi, 
    data.kriteria, 
    data.kategori,
    data.tindak
  ]);
  return "Sukses! KKTP tersimpan.";
}

// 2. AMBIL DATA KKTP
function getDataKKTP(filterKelas, filterSem) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_kktp");
  if (!ws || ws.getLastRow() < 2) return [];
  
  const data = ws.getRange(2, 1, ws.getLastRow()-1, 10).getDisplayValues();
  
  return data
    .map((r, i) => ({
      rowIdx: i + 2,
      no: r[0],
      fase: r[1],
      kelas: r[2],
      semester: r[3],
      bab: r[4],
      alur: r[5],
      materi: r[6],
      kriteria: r[7],
      kategori: r[8],
      tindak: r[9]
    }))
    .filter(r => r.kelas == filterKelas && r.semester == filterSem);
}

// 3. UPDATE KKTP
function updateKKTP(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_kktp");
  
  ws.getRange(parseInt(data.rowIdx), 2, 1, 9).setValues([[
    data.fase, data.kelas, data.semester, data.bab, data.alur, data.materi, data.kriteria, data.kategori, data.tindak
  ]]);
  return "Sukses! KKTP diperbarui.";
}

// 4. HAPUS KKTP
function hapusKKTP(idx) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_kktp");
  ws.deleteRow(parseInt(idx));
  return "Data dihapus.";
}

// 5. FITUR PINTAR: AMBIL OPSI TP DARI PROSEM
function getTPFromProsem(kelas, sem) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_prosem");
  if (!ws || ws.getLastRow() < 2) return [];
  
  const data = ws.getRange(2, 1, ws.getLastRow()-1, 8).getDisplayValues(); // Col 3=Kelas, 4=Sem, 6=TP
  
  // Ambil TP yang sesuai kelas & semester
  let tps = data
    .filter(r => r[2] == kelas && r[3] == sem)
    .map(r => r[5]); // Kolom F adalah TP
    
  return [...new Set(tps)]; // Hapus duplikat
}
