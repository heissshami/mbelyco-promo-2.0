require('dotenv').config();
const db = require('../db');
const { jsPDF } = require('jspdf');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { batchId, format } = req.body;

  if (!batchId || !format) {
    return res.status(400).json({ message: 'Batch ID and format are required' });
  }

  if (format !== 'csv' && format !== 'pdf') {
    return res.status(400).json({ message: 'Format must be either csv or pdf' });
  }

  try {
    // Get batch information
    const batchResult = await db.query('SELECT * FROM batches WHERE id = $1', [batchId]);
    
    if (batchResult.rows.length === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const batch = batchResult.rows[0];

    // Get promo codes for this batch
    const codesResult = await db.query('SELECT * FROM promo_codes WHERE batch_id = $1', [batchId]);
    const codes = codesResult.rows;

    if (codes.length === 0) {
      return res.status(404).json({ message: 'No codes found for this batch' });
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = ['code', 'batch', 'amount', 'currency', 'status', 'created'];
      const rows = codes.map(code => [
        code.code,
        batch.name,
        code.amount,
        code.currency,
        code.status,
        new Date(code.created_at).toLocaleString()
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => 
        row.map(value => `"${String(value).replace(/"/g, '\"')}"`).join(',')
      )].join('\n');

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${batch.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);

    } else if (format === 'pdf') {
      // Generate PDF
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const page = { width: 210, height: 297 };

      // Template layout
      const headerY = 25;
      const footerY = page.height - 25;
      const contentTop = 50;
      const contentBottom = 50;
      const availableH = page.height - contentTop - contentBottom;

      // Grid: 3 cols x 4 rows
      const grid = { cols: 3, rows: 4, colGap: 8, rowGap: 8, cellW: 40, cellH: 40 };
      const gridW = grid.cellW * grid.cols + grid.colGap * (grid.cols - 1);
      const gridH = grid.cellH * grid.rows + grid.rowGap * (grid.rows - 1);
      const startX = (page.width - gridW) / 2;
      const startY = contentTop + (availableH - gridH) / 2;
      const perPage = grid.cols * grid.rows;
      const pages = Math.max(1, Math.ceil(codes.length / perPage));

      // Draw header function
      const drawHeader = (currentPage) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text(batch.name.toUpperCase(), page.width / 2, headerY, { align: 'center' });
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(`${currentPage}/${pages}`, page.width / 2, footerY, { align: 'center' });
      };

      // Draw cell function
      const drawCell = (ix, iy, code, amount) => {
        const x = startX + ix * (grid.cellW + grid.colGap);
        const y = startY + iy * (grid.cellH + grid.rowGap);
        const centerX = x + grid.cellW / 2;
        const codeY = y + grid.cellH / 2 + 2;
        const amountY = codeY - 6;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(String(amount || ''), centerX, amountY, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(String(code || '').toUpperCase(), centerX, codeY, { align: 'center' });
      };

      // Generate PDF content
      codes.forEach((code, idx) => {
        const pageIdx = Math.floor(idx / perPage);
        if (idx % perPage === 0) {
          if (pageIdx > 0) doc.addPage();
          drawHeader(pageIdx + 1);
        }
        
        const within = idx % perPage;
        const row = Math.floor(within / grid.cols);
        const col = within % grid.cols;
        
        drawCell(col, row, code.code, `${code.amount.toLocaleString()} ${code.currency}`);
      });

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${batch.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Send PDF as buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      res.send(pdfBuffer);
    }

  } catch (error) {
    console.error('Error during download:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};