// --- Prosem.gs ---

// 1. SIMPAN PROSEM
function simpanProsem(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_prosem"); // Sudah diperbaiki ke db_prosem
  if (!ws) return "Error: Database db_prosem tidak ditemukan!";
  
  const jsonMatriks = JSON.stringify(data.matriks);

  ws.appendRow([
    ws.getLastRow(), 
    data.fase, 
    data.kelas, 
    data.semester, 
    data.elemen, 
    data.tp, 
    data.jp,
    jsonMatriks
  ]);
  return "Sukses! Data Prosem tersimpan.";
}

// 2. AMBIL DATA PROSEM
function getDataProsem(filterKelas, filterSem) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_prosem"); // Fix db_prosem
  if (!ws || ws.getLastRow() < 2) return [];
  
  const data = ws.getRange(2, 1, ws.getLastRow()-1, 8).getDisplayValues();
  
  return data
    .map((r, i) => ({
      rowIdx: i + 2,
      no: r[0],
      fase: r[1],
      kelas: r[2],
      semester: r[3],
      elemen: r[4],
      tp: r[5],
      jp: r[6],
      matriks: JSON.parse(r[7] || "{}")
    }))
    .filter(r => r.kelas == filterKelas && r.semester == filterSem);
}

// 3. UPDATE PROSEM
function updateProsem(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_prosem"); // Fix db_prosem
  const jsonMatriks = JSON.stringify(data.matriks);
  
  ws.getRange(parseInt(data.rowIdx), 2, 1, 7).setValues([[
    data.fase, data.kelas, data.semester, data.elemen, data.tp, data.jp, jsonMatriks
  ]]);
  return "Sukses! Prosem diperbarui.";
}

// 4. HAPUS PROSEM
function hapusProsem(idx) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_prosem"); // Fix db_prosem
  ws.deleteRow(parseInt(idx));
  return "Data dihapus.";
}
// 5. HELPER: AMBIL DATA TP UNTUK INPUT PROSEM BARU
function getTPForProsem(kelas, semester) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_tp");
  if (!ws || ws.getLastRow() < 2) return [];
  
  // Filter Key di db_tp kolom D biasanya "VII/1" atau "VII/2"
  const key = kelas + "/" + semester; 
  
  const data = ws.getRange(2, 1, ws.getLastRow()-1, 9).getDisplayValues();
  
  // Ambil data TP yang cocok dengan Kelas & Semester
  return data
    .filter(r => r[3] == key) // Kolom D = Kelas/Sem
    .map(r => ({
      no: r[1],      // Alur
      elemen: r[4],  // Materi Pokok
      tp: r[5],      // Tujuan Pembelajaran
      jp: r[2]       // Alokasi Waktu
    }))
    .sort((a,b) => parseInt(a.no) - parseInt(b.no));
}
