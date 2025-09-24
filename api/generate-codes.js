require('dotenv').config();
const db = require('../db');

// Replicate the same code generation algorithm from app.js
function randomCodePart(length) {
  const CHARS = 'ACEFGHJKLMNPRSTUWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

function generateCode(createdAt) {
  const YY = String(createdAt.getFullYear()).slice(-2);
  const MM = String(createdAt.getMonth() + 1).padStart(2, '0');
  const DD = String(createdAt.getDate()).padStart(2, '0');
  return `${randomCodePart(4)}-${randomCodePart(2)}${YY}-${randomCodePart(2)}${MM}-${randomCodePart(2)}${DD}`;
}

// Helper function for date formatting (replicates app.js functionality)
function fmtDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    name,
    total_codes,
    amount_per_code,
    currency = 'RWF',
    expiration_date,
    description = 'Generated batch',
    assigned_user = 'Generator'
  } = req.body;

  // Validate required fields (replicates client-side validation)
  if (!name || !total_codes || !amount_per_code || !expiration_date) {
    return res.status(400).json({ 
      message: 'Name, total codes, amount per code, and expiration date are required' 
    });
  }

  // Validate total codes limit (1-100,000 as per PRD)
  if (total_codes < 1 || total_codes > 100000) {
    return res.status(400).json({ 
      message: 'Total codes must be between 1 and 100,000' 
    });
  }

  try {
    // Generate batch ID (replicates client-side pattern)
    const batchCountResult = await db.query('SELECT COUNT(*) FROM batches');
    const batchCount = parseInt(batchCountResult.rows[0].count) || 0;
    const batchId = `b${batchCount + 1}`;

    // Ensure batch name starts with BATCH_ (replicates client-side behavior)
    const formattedName = name.startsWith('BATCH_') ? name : `BATCH_${name}`;

    // Create batch in database
    const batchInsertQuery = `
      INSERT INTO batches (
        id, name, description, total_codes, amount_per_code, 
        currency, expiration_date, assigned_user, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const batchValues = [
      batchId,
      formattedName,
      description,
      total_codes,
      amount_per_code,
      currency,
      new Date(expiration_date),
      assigned_user,
      'active',
      new Date()
    ];

    const batchResult = await db.query(batchInsertQuery, batchValues);
    const batch = batchResult.rows[0];

    // Generate promo codes
    const codes = [];
    const createdAt = new Date();
    
    for (let i = 0; i < total_codes; i++) {
      const code = generateCode(createdAt);
      codes.push({
        code,
        batch_id: batchId,
        batch_name: formattedName,
        amount: amount_per_code,
        currency,
        status: 'active',
        created_at: createdAt
      });
    }

    // Insert codes in batches to avoid overwhelming the database
    const codesInsertQuery = `
      INSERT INTO promo_codes (code, batch_id, batch_name, amount, currency, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const code of codes) {
      await db.query(codesInsertQuery, [
        code.code,
        code.batch_id,
        code.batch_name,
        code.amount,
        code.currency,
        code.status,
        code.created_at
      ]);
    }

    // Return response that matches what the client expects
    res.status(201).json({
      success: true,
      message: `Generated ${total_codes} codes in ${formattedName}`,
      batch: {
        id: batchId,
        name: formattedName,
        total_codes: total_codes,
        amount_per_code: amount_per_code,
        currency: currency,
        status: 'active'
      },
      codes_generated: total_codes
    });

  } catch (error) {
    console.error('Error generating codes:', error);
    res.status(500).json({ 
      message: 'Internal server error during code generation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};