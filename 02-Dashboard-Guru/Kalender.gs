function getKalenderData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const wsAgenda = ss.getSheetByName("db_kalender");
  const wsSettings = ss.getSheetByName("db_pengaturan");
  
  // --- BAGIAN 1: AMBIL DATA AGENDA (DENGAN NOMOR BARIS UNTUK EDIT) ---
  let agendaList = [];
  if (wsAgenda && wsAgenda.getLastRow() >= 2) {
    const data = wsAgenda.getRange(2, 1, wsAgenda.getLastRow() - 1, 4).getDisplayValues();
    agendaList = data.map((row, index) => ({
      rowIndex: index + 2, // Simpan nomor baris Excel (mulai dari baris 2)
      no: row[0],
      tanggal: row[1],
      kegiatan: row[2],
      label: row[3].toLowerCase()
    }));
  }
  
  // --- BAGIAN 2: AMBIL & KONVERSI LINK PENGATURAN ---
  let files = { img: "", pdf: "" };

  // Helper Pintar: Ekstrak ID Bersih (Menangani jika user paste ID saja atau Link Lengkap)
  const cleanId = (str) => {
     if(!str) return "";
     let s = str.toString().trim();
     if(s.includes("/d/")) return s.split('/d/')[1].split('/')[0]; // Jika link folder/file
     if(s.includes("id=")) return s.split('id=')[1].split('&')[0]; // Jika link export
     return s; // Asumsi input sudah berupa ID murni
  };

  if (wsSettings) {
    const dataSet = wsSettings.getDataRange().getValues();
    dataSet.forEach(row => {
      let key = row[0].toString().trim();
      let val = row[1].toString().trim();
      
      if (key == 'kalender_img') {
         // [FIX] GUNAKAN LINK THUMBNAIL AGAR MUNCUL SEBAGAI GAMBAR
         let id = cleanId(val);
         files.img = "https://drive.google.com/thumbnail?id=" + id + "&sz=w1000"; 
      }
      
      if (key == 'kalender_pdf') {
         // [FIX] GUNAKAN LINK VIEW UNTUK DOKUMEN PDF
         let id = cleanId(val);
         files.pdf = "https://drive.google.com/uc?export=view&id=" + id;
      }
    });
  }
  
  return { agenda: agendaList, files: files };
}

// --- FUNGSI BARU: SIMPAN AGENDA (TAMBAH / EDIT) ---
function simpanAgendaKalender(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ws = ss.getSheetByName("db_kalender");
  if (!ws) return "Database db_kalender tidak ditemukan!";
  
  const rowData = [data.no, data.tanggal, data.kegiatan, data.label];
  
  if (data.rowIndex) {
    // Mode EDIT: Timpa baris yang ada
    ws.getRange(data.rowIndex, 1, 1, 4).setValues([rowData]);
    return "Agenda berhasil diperbarui!";
  } else {
    // Mode BARU: Tambah di paling bawah
    // Auto-numbering sederhana jika 'no' kosong
    if (!data.no) rowData[0] = ws.getLastRow(); 
    ws.appendRow(rowData);
    return "Agenda baru berhasil disimpan!";
  }
}

// --- FUNGSI BARU: HAPUS AGENDA ---
function hapusAgendaKalender(rowIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_kalender");
  if (ws) {
    ws.deleteRow(parseInt(rowIndex));
    return "Agenda dihapus.";
  }
  return "Gagal menghapus.";
}
