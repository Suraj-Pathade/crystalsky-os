/**
 * CSV & File Export Service for CrystalSky OS
 * Owner: Suraj Pathade (9922639066)
 * Brand: CrystalSky Photography & Film
 */

/**
 * Convert JSON array to CSV format and trigger download
 */
export function exportToCSV(dataArray, filename = 'CrystalSky_Data.csv') {
  if (!dataArray || !dataArray.length) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(dataArray[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of dataArray) {
    const values = headers.map(header => {
      const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print element helper
 */
export function printElement(elementId) {
  const elem = document.getElementById(elementId);
  if (!elem) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>CrystalSky Photography & Film - Document</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #111; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
          th { background-color: #000; color: #f59e0b; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-bottom: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>CrystalSky Photography & Film</h2>
          <p>Owner: Suraj Pathade | Phone: 9922639066</p>
        </div>
        ${elem.innerHTML}
        <div class="footer">
          Generated via CrystalSky OS
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
