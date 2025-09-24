// API Integration for Generate Codes functionality
// This file defines the API-based functions for code generation

// Define the functions directly instead of overriding
console.log('Defining Generate Codes API functions');

// Define the openGenerateForm function
window.openGenerateForm = function() {
    // Open the generate form modal
    if (window.openModal) {
        window.openModal('generateFormModal');
    }
    // Setup the form
    setupGenerateFormAPI();
};
    
    // Define the form submission handler
    window.onGenerateSubmit = async function(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById('gfName');
        const totalInput = document.getElementById('gfTotal');
        const amountInput = document.getElementById('gfAmount');
        const currencySelect = document.getElementById('gfCurrency');
        const expiryInput = document.getElementById('gfExpiry');
        const userSelect = document.getElementById('gfUser');
        const descTextarea = document.getElementById('gfDesc');
        
        // Validate inputs (replicate client-side validation)
        if (!nameInput.value.trim()) {
            showToast('Please enter a batch name', 'error');
            nameInput.focus();
            return;
        }
        
        if (!totalInput.value || totalInput.value < 1 || totalInput.value > 100000) {
            showToast('Total codes must be between 1 and 100,000', 'error');
            totalInput.focus();
            return;
        }
        
        if (!amountInput.value || amountInput.value < 1) {
            showToast('Please enter a valid amount per code', 'error');
            amountInput.focus();
            return;
        }
        
        if (!expiryInput.value) {
            showToast('Please select an expiration date', 'error');
            expiryInput.focus();
            return;
        }
        
        // Format batch name to start with BATCH_ (replicate client behavior)
        const batchName = nameInput.value.trim().startsWith('BATCH_') 
            ? nameInput.value.trim() 
            : 'BATCH_' + nameInput.value.trim();
        
        // Prepare API request data
        const requestData = {
            name: batchName,
            total_codes: parseInt(totalInput.value),
            amount_per_code: parseFloat(amountInput.value),
            currency: currencySelect.value,
            expiration_date: expiryInput.value,
            description: descTextarea.value.trim() || 'Generated batch',
            assigned_user: userSelect.value || 'Generator'
        };
        
        try {
            // Show generating modal
            if (window.openModal) {
                window.openModal('generatingModal');
            }
            
            // Update progress UI
            const progressFill = document.getElementById('genProgressFill');
            const progressText = document.getElementById('genProgressText');
            const etaText = document.getElementById('genEtaText');
            
            if (progressFill) progressFill.style.width = '0%';
            if (progressText) progressText.textContent = `0 of ${requestData.total_codes} codes generated`;
            if (etaText) etaText.textContent = 'ETA: --s';
            
            // Call the serverless function
            const response = await fetch('/api/generate-codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate codes');
            }
            
            const result = await response.json();
            
            // Simulate progress animation (for UX consistency)
            const totalCodes = requestData.total_codes;
            let generated = 0;
            
            const progressInterval = setInterval(() => {
                generated += Math.ceil(totalCodes / 20); // 20 steps
                if (generated >= totalCodes) {
                    generated = totalCodes;
                    clearInterval(progressInterval);
                    
                    // Complete the process
                    setTimeout(() => {
                        if (window.closeModal) {
                            window.closeModal('generatingModal');
                            window.closeModal('generateFormModal');
                        }
                        
                        // Show success message
                        showToast(result.message || `Successfully generated ${totalCodes} codes`, 'success');
                        
                        // Refresh the UI if needed
                        if (window.renderBatches && window.renderCodes) {
                            window.renderBatches();
                            window.renderCodes();
                        }
                        
                        // Reset form
                        if (document.getElementById('generateForm')) {
                            document.getElementById('generateForm').reset();
                        }
                        
                    }, 500);
                }
                
                // Update progress UI
                const percentage = (generated / totalCodes) * 100;
                if (progressFill) progressFill.style.width = percentage + '%';
                if (progressText) progressText.textContent = `${generated} of ${totalCodes} codes generated`;
                
            }, 100);
            
        } catch (error) {
            console.error('Error generating codes:', error);
            
            if (window.closeModal) {
                window.closeModal('generatingModal');
            }
            
            showToast(error.message || 'Failed to generate codes. Please try again.', 'error');
        }
    };
    
    // Set up form event listeners for API integration
    function setupGenerateFormAPI() {
        const form = document.getElementById('generateForm');
        const submitBtn = document.getElementById('generateFormSubmit');
        const cancelBtn = document.getElementById('generateFormCancel');
        const closeBtn = document.getElementById('generateFormClose');
        
        if (form) {
            form.addEventListener('submit', window.onGenerateSubmit);
        }
        
        if (submitBtn) {
            submitBtn.onclick = function() {
                if (form && form.reportValidity()) {
                    form.dispatchEvent(new Event('submit'));
                }
            };
        }
        
        // Set up cancel/close behavior
        if (cancelBtn && window.closeModal) {
            cancelBtn.onclick = function() { window.closeModal('generateFormModal'); };
        }
        
        if (closeBtn && window.closeModal) {
            closeBtn.onclick = function() { window.closeModal('generateFormModal'); };
        }
    }
    
    // Helper function to show toast messages
    function showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            // Fallback toast implementation
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = 'position:fixed; top:20px; right:20px; padding:12px 16px; border-radius:6px; z-index:10000;';
            
            document.body.appendChild(toast);
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('API Generate Codes functions initialized');
    });