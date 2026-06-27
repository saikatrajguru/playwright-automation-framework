const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');
const path = require('path');
const os = require('os');

// Download directory: uses OS temp folder — works on any machine
const DOWNLOAD_PATH = path.join(os.tmpdir(), 'download.xlsx');

async function writeExcelTest(searchText, replaceText, change, filePath) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output = await readExcel(worksheet, searchText);
  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output.row = rowNumber;
        output.column = colNumber;
      }
    });
  });
  return output;
}

test('Upload download — Excel read/write validation', async ({ page }) => {
  const textSearch = 'Mango';
  const updateValue = '350';

  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

  // Download the file and save to temp directory
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;
  await download.saveAs(DOWNLOAD_PATH);

  // Update the Excel file programmatically
  await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, DOWNLOAD_PATH);

  // Re-upload the modified file
  await page.locator('#fileinput').setInputFiles(DOWNLOAD_PATH);

  // Verify the updated value appears in the table
  const textLocator = page.getByText(textSearch);
  const desiredRow = page.getByRole('row').filter({ has: textLocator });
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
});
