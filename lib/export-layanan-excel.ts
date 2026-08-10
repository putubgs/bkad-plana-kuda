import ExcelJS from "exceljs";
import type { LayananMasuk } from "@/data/data-layanan";

const HEADER_FILL_ARGB = "FF0F2044";
const HEADER_FONT_ARGB = "FFFFFFFF";
const BORDER_ARGB = "FFE2E8F0";

export async function exportLayananToExcel(
  data: LayananMasuk[],
  filenamePrefix = "layanan-masuk"
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "BKAD NTB - Plana Kuda";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Layanan Masuk");

  sheet.columns = [
    { header: "No. Tiket", key: "noTiket", width: 16 },
    { header: "Tanggal Masuk", key: "tglMasuk", width: 16 },
    { header: "Durasi", key: "durasi", width: 18 },
    { header: "Perlu Tindak Lanjut", key: "perluTindakLanjut", width: 20 },
    { header: "Nama Pemohon", key: "namaPemohon", width: 26 },
    { header: "Asal Instansi", key: "asalInstansi", width: 30 },
    { header: "Bidang/UPTB", key: "bidangUptb", width: 45 },
    { header: "Status", key: "status", width: 16 },
  ];

  data.forEach((item) => {
    sheet.addRow({
      noTiket: item.noTiket,
      tglMasuk: item.tglMasuk,
      durasi: item.durasiLabel,
      perluTindakLanjut: item.perluTindakLanjut ? "Ya" : "Tidak",
      namaPemohon: item.namaPemohon,
      asalInstansi: item.asalInstansi,
      bidangUptb: item.bidangUptb.join(", "),
      status: item.status,
    });
  });

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: HEADER_FONT_ARGB } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: HEADER_FILL_ARGB },
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
  });
  headerRow.height = 22;

  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = {
        bottom: { style: "thin", color: { argb: BORDER_ARGB } },
      };
    });
    if (rowNumber > 1) {
      row.height = 20;
    }
  });

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columns.length },
  };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenamePrefix}-${timestamp}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
