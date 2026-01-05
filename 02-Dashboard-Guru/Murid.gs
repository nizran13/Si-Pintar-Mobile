// --- Murid.gs ---

// 1. FUNGSI MENYIMPAN DATA MURID BARU
function simpanMuridBaru(formObj) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const folderId = getFolderId(ss); // Ambil ID Folder
    if (!folderId) return "Error: ID Folder Foto belum disetting!";

    // Proses Upload Foto
    let fileId = "-"; 
    if (formObj.fotoData && formObj.fotoNama) {
      fileId = uploadFotoKeDrive(folderId, formObj.fotoData, formObj.fotoNama);
    }

    const wsMurid = ss.getSheetByName("db_murid");
    const lastRow = wsMurid.getLastRow();
    const noUrut = lastRow; // Counter sederhana

    // Urutan: [No, ID_Foto, Nama, NIS, JK, Kelas, Status]
    wsMurid.appendRow([noUrut, fileId, formObj.nama, formObj.nis, formObj.jk, formObj.kelas, formObj.status]);

    return "Sukses! Data murid berhasil disimpan.";
  } catch (e) { return "Gagal: " + e.toString(); }
}

// 2. (BARU) FUNGSI UPDATE DATA MURID (EDIT)
function updateMurid(formObj) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName("db_murid");
    const rowIndex = parseInt(formObj.rowIdx); // Baris yang mau diedit
    
    // Cek apakah ada foto baru?
    let fileId = formObj.oldFotoId; // Default pakai foto lama
    if (formObj.fotoData && formObj.fotoNama) {
       const folderId = getFolderId(ss);
       fileId = uploadFotoKeDrive(folderId, formObj.fotoData, formObj.fotoNama);
    }

    // Update Data di Baris Tersebut (Kolom 2 s/d 7 -> Foto, Nama, NIS, JK, Kelas, Status)
    // Ingat: Kolom A itu No (kita skip/biarkan), jadi mulai Kolom B (2)
    const dataUpdate = [[fileId, formObj.nama, formObj.nis, formObj.jk, formObj.kelas, formObj.status]];
    ws.getRange(rowIndex, 2, 1, 6).setValues(dataUpdate);

    return "Sukses! Data murid berhasil diperbarui.";
  } catch (e) { return "Gagal Update: " + e.toString(); }
}

// 3. (BARU) FUNGSI HAPUS MURID
function hapusMurid(rowIndex) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName("db_murid");
    ws.deleteRow(parseInt(rowIndex)); // Hapus baris fisik
    return "Data berhasil dihapus.";
  } catch (e) { return "Gagal Hapus: " + e.toString(); }
}

// 4. FUNGSI MEMBACA DATA (Update: Sertakan Nomor Baris Fisik)
function getMuridData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("db_murid");
  if (!ws || ws.getLastRow() < 2) return [];

  // Ambil data
  const data = ws.getRange(2, 1, ws.getLastRow() - 1, 7).getDisplayValues();
  
  // Return data + row index (i + 2 karena array mulai 0 tapi baris sheet mulai 1, dan ada header 1 baris)
  return data.map((row, i) => ({
    rowIdx: i + 2, // Kunci PENTING untuk edit/hapus
    no: row[0],
    fotoId: row[1],
    nama: row[2],
    nis: row[3],
    jk: row[4],
    kelas: row[5],
    status: row[6]
  }));
}

// --- HELPER FUNCTION (Biar rapi) ---
function getFolderId(ss) {
  const wsSettings = ss.getSheetByName("db_pengaturan");
  const dataSet = wsSettings.getDataRange().getValues();
  let fid = "";
  dataSet.forEach(r => { if(r[0] == 'folder_foto_siswa') fid = r[1]; });
  return fid;
}

function uploadFotoKeDrive(folderId, base64Data, fileName) {
  const contentType = base64Data.substring(5, base64Data.indexOf(';'));
  const bytes = Utilities.base64Decode(base64Data.substr(base64Data.indexOf('base64,')+7));
  const blob = Utilities.newBlob(bytes, contentType, fileName);
  const folder = DriveApp.getFolderById(folderId);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getId();
}

// FUNGSI PANCINGAN
function pancingIzin() { DriveApp.createFile("Tes_Izin.txt", "Pancingan"); }
