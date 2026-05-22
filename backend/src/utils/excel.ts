import ExcelJS from 'exceljs';

export async function createWorkbook() {
  const workbook = new ExcelJS.Workbook();
  return workbook;
}
