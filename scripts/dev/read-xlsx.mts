import ExcelJS from 'exceljs'
const wb = new ExcelJS.Workbook()
await wb.xlsx.readFile(process.argv[2])
for (const ws of wb.worksheets) {
  console.log(`== ${ws.name} (${ws.rowCount} rows)`)
  ws.eachRow((row, n) => { if (n <= 4) console.log('  ', (row.values as unknown[]).slice(1).map(v => typeof v === 'object' && v ? JSON.stringify(v) : v).join(' | ')) })
}
