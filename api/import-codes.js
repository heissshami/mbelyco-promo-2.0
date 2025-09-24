const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to parse CSV content
function parseCSV(content) {
    const lines = content.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) {
        throw new Error('Empty CSV file');
    }

    // Parse header row
    const header = lines[0];
    const cols = header.split(',').map(s => s.replace(/"/g, '"').replace(/^"|"$/g, ''));
    
    // Find column indices
    const idx = {
        code: cols.indexOf('code'),
        batch: cols.indexOf('batch'),
        amount: cols.indexOf('amount'),
        currency: cols.indexOf('currency'),
        status: cols.indexOf('status'),
        created: cols.indexOf('created')
    };

    // Parse data rows
    const imported = [];
    let batchName = null;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(',').map(s => s.replace(/"/g, '"').replace(/^"|"$/g, ''));
        
        const code = parts[idx.code];
        const bn = parts[idx.batch];
        const amount = Number(parts[idx.amount] || 0);
        const currency = parts[idx.currency] || 'RWF';
        const status = parts[idx.status] || 'active';
        const created = parts[idx.created] ? new Date(parts[idx.created]) : new Date();
        
        batchName = batchName || bn || 'IMPORTED_BATCH';
        
        if (code) {
            imported.push({
                code,
                bn: bn || batchName,
                amount,
                currency,
                status,
                created
            });
        }
    }

    return { imported, batchName };
}

// Helper function to validate and process settings import
function validateSettings(settings) {
    // Basic validation to ensure it's a valid settings object
    if (typeof settings !== 'object' || settings === null) {
        throw new Error('Invalid settings format');
    }
    
    // You can add more specific validation here based on your settings structure
    return settings;
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { file, fileName, importType, options } = req.body;

        if (!file || !fileName) {
            return res.status(400).json({ error: 'File content and file name are required' });
        }

        // Determine import type based on file extension or explicit parameter
        const fileExtension = fileName.toLowerCase().split('.').pop();
        const isCSV = importType === 'csv' || fileExtension === 'csv';
        const isSettings = importType === 'settings' || fileExtension === 'json';

        if (isCSV) {
            // Handle CSV import for promo codes
            const { imported, batchName } = parseCSV(file);

            if (imported.length === 0) {
                return res.status(400).json({ error: 'No valid codes found in CSV' });
            }

            // Check if batch already exists
            const { data: existingBatch, error: batchError } = await supabase
                .from('batches')
                .select('*')
                .eq('name', batchName)
                .single();

            let batchId;
            if (existingBatch) {
                batchId = existingBatch.id;
            } else {
                // Create new batch
                const { data: newBatch, error: createError } = await supabase
                    .from('batches')
                    .insert([{
                        name: batchName,
                        description: 'Imported CSV',
                        total_codes: imported.length,
                        amount_per_code: imported[0].amount || 0,
                        currency: imported[0].currency || 'RWF',
                        expiration_date: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1),
                        assigned_user: 'Importer',
                        status: 'active',
                        created_at: new Date()
                    }])
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating batch:', createError);
                    return res.status(500).json({ error: 'Failed to create batch' });
                }
                batchId = newBatch.id;
            }

            // Prepare codes for insertion
            const codesToInsert = imported.map((row, index) => ({
                code: row.code,
                batch_id: batchId,
                batch_name: batchName,
                amount: row.amount,
                currency: row.currency,
                status: row.status,
                created_at: row.created
            }));

            // Insert codes in batches to avoid payload size limits
            const batchSize = 100;
            for (let i = 0; i < codesToInsert.length; i += batchSize) {
                const batch = codesToInsert.slice(i, i + batchSize);
                const { error: insertError } = await supabase
                    .from('promo_codes')
                    .insert(batch);

                if (insertError) {
                    console.error('Error inserting codes:', insertError);
                    return res.status(500).json({ error: 'Failed to insert some codes' });
                }
            }

            // Update batch code count if batch already existed
            if (existingBatch) {
                const { error: updateError } = await supabase
                    .from('batches')
                    .update({ total_codes: existingBatch.total_codes + imported.length })
                    .eq('id', batchId);

                if (updateError) {
                    console.error('Error updating batch:', updateError);
                }
            }

            return res.status(200).json({
                success: true,
                message: `Imported ${imported.length} codes into ${batchName}`,
                importedCount: imported.length,
                batchName: batchName,
                batchId: batchId
            });

        } else if (isSettings) {
            // Handle settings import
            try {
                const settings = JSON.parse(file);
                const validatedSettings = validateSettings(settings);

                // In a real implementation, you might want to store settings in a database
                // For now, we'll just validate and return success
                
                return res.status(200).json({
                    success: true,
                    message: 'Settings imported successfully',
                    settings: validatedSettings
                });

            } catch (parseError) {
                return res.status(400).json({ error: 'Invalid JSON format in settings file' });
            }

        } else {
            return res.status(400).json({ error: 'Unsupported file type. Please use CSV or JSON files.' });
        }

    } catch (error) {
        console.error('Import error:', error);
        return res.status(500).json({ 
            error: 'Failed to import file',
            details: error.message 
        });
    }
};