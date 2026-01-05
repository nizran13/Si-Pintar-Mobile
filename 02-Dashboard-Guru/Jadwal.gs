// --- Jadwal.gs (VERSI FINAL - CRUD LENGKAP) ---

// 1. AMBIL DATA JADWAL (PLUS INDEX BARIS)
function getJadwalData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_jadwal");
  
  if (!ws || ws.getLastRow() < 2) return [];
  
  // Ambil data dari baris 2 sampai bawah
  const data = ws.getRange(2, 1, ws.getLastRow() - 1, 6).getDisplayValues();
  
  // Map data + Row Index (Penting untuk Edit/Hapus)
  return data.map((row, i) => ({
    rowIndex: i + 2, // Baris Excel dimulai dari 1, header baris 1, jadi data mulai baris 2
    no: row[0],
    hari: row[1],
    jam: row[2],
    waktu: row[3],
    kelas: row[4],
    mapel: row[5]
  }));
}

// 2. SIMPAN JADWAL (BISA TAMBAH BARU ATAU EDIT)
function simpanJadwal(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_jadwal");
  if (!ws) return "Database db_jadwal tidak ditemukan!";
  
  // Format Data: [No, Hari, Jam, Waktu, Kelas, Mapel]
  // Catatan: Kolom 'No' kita biarkan kosong atau isi manual, atau bisa diabaikan.
  const rowData = ["", data.hari, data.jam, data.waktu, data.kelas, data.mapel];
  
  if (data.rowIndex) {
    // --- MODE EDIT: UPDATE BARIS LAMA ---
    // Pertahankan Nomor Urut Lama (Kolom A)
    const oldNo = ws.getRange(data.rowIndex, 1).getValue();
    rowData[0] = oldNo; 
    
    ws.getRange(data.rowIndex, 1, 1, 6).setValues([rowData]);
    return "Jadwal berhasil diperbarui!";
  } else {
    // --- MODE BARU: TAMBAH DI BAWAH ---
    // Auto Numbering Sederhana
    rowData[0] = ws.getLastRow(); 
    ws.appendRow(rowData);
    return "Jadwal baru berhasil ditambahkan!";
  }
}

// 3. HAPUS JADWAL
function hapusJadwal(rowIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_jadwal");
  
  if (ws) {
    ws.deleteRow(parseInt(rowIndex));
    return "Jadwal berhasil dihapus.";
  }
  return "Gagal menghapus data.";
}
