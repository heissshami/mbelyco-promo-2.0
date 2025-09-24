// Download API Integration - Defines download functionality to use serverless functions
// This script should be loaded before app.js to provide direct implementation

(function() {
    'use strict';

    // We'll define these functions directly instead of overriding them
    // app.js will use these implementations

    // Define openDownloadModal function directly
    window.openDownloadModal = function(batchId) {
        console.log('API version of openDownloadModal');
        
        // Populate batch dropdown
        const sel = document.getElementById('downloadBatch');
        if (sel) {
            sel.innerHTML = '';
            if (window.state && window.state.batches) {
                window.state.batches.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b.id;
                    opt.textContent = `${b.name} (${b.total_codes})`;
                    sel.appendChild(opt);
                });
            }
            if (batchId) {
                sel.value = batchId;
            }
        }

        // Open the modal using the original modal system
        if (window.modal && window.modal.open) {
            window.modal.open();
        } else {
            // Use a simple alert if modal system not available
            alert('Download modal cannot be opened. Modal system not available.');
        }
    };

    // Define handleDownloadConfirm function directly
    window.handleDownloadConfirm = async function() {
        console.log('API version of handleDownloadConfirm');
        
        // Validate form first
        if (!validateDownloadForm()) {
            return;
        }

        // Get form values
        const batchId = document.getElementById('downloadBatch').value;
        const format = document.querySelector('input[name="dlFormat"]:checked').value;
        const batch = window.state.batches.find(b => b.id === batchId);

        if (!batch) {
            console.error('Batch not found');
            return;
        }

        // Start download with progress
        await downloadCodesWithProgressAPI(format, batch);
    };

    // API-based download with progress
    async function downloadCodesWithProgressAPI(format, batch) {
        console.log('Starting API download for format:', format, 'batch:', batch.id);

        // Close the download form modal
        if (window.closeModal) {
            window.closeModal('downloadModal');
        }

        // Open the progress modal
        if (window.openModal) {
            window.openModal('downloadProgressModal');
        }

        const totalCodes = window.state.codes.filter(c => c.batch_id === batch.id).length;

        // Progress animation
        let processed = 0;
        const start = Date.now();
        const targetMs = Math.min(6000, Math.max(2000, totalCodes * 5));
        const fill = document.getElementById('downloadProgressFill');
        const txt = document.getElementById('downloadProgressText');
        const eta = document.getElementById('downloadEtaText');

        function tick() {
            const elapsed = Date.now() - start;
            const progress = Math.min(1, elapsed / targetMs);
            processed = Math.floor(totalCodes * progress);
            
            if (fill) {
                fill.style.width = `${Math.round(progress * 100)}%`;
                fill.style.transition = 'width 0.1s ease';
            }
            
            if (txt) {
                txt.textContent = `${processed.toLocaleString()} of ${totalCodes.toLocaleString()} codes processed`;
            }
            
            if (eta) {
                const remaining = Math.max(0, targetMs - elapsed);
                eta.textContent = `ETA: ${Math.ceil(remaining / 1000)}s`;
            }

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                // Ensure progress bar reaches 100%
                if (fill) fill.style.width = '100%';

                // Perform the actual API download
                performAPIDownload(format, batch);
            }
        }

        tick();
    }

    // Perform the actual API download
    async function performAPIDownload(format, batch) {
        try {
            console.log('Calling download API for batch:', batch.id, 'format:', format);
            
            const response = await fetch('/api/download-codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    batchId: batch.id,
                    format: format
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // Get the filename from content-disposition or generate one
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `${batch.name}_${new Date().toISOString().slice(0, 10)}.${format}`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Create blob and download
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            // Show success message
            if (window.showSuccessMessage) {
                window.showSuccessMessage(`${format.toUpperCase()} file downloaded successfully!`);
            } else if (window.toast) {
                window.toast(`${format.toUpperCase()} download started`, 'success');
            }

        } catch (error) {
            console.error('Download API error:', error);
            
            // Show error message if API fails
            console.log('API download failed');
            
            if (window.toast) {
                window.toast('Download failed. Please try again later.', 'error');
            }
        } finally {
            // Close progress modal
            if (window.closeModal) {
                setTimeout(() => {
                    window.closeModal('downloadProgressModal');
                }, 500);
            }
        }
    }

    // Copy validation functions from app.js
    function validateDownloadForm() {
        const format = document.querySelector('input[name="dlFormat"]:checked');
        const batch = document.getElementById('downloadBatch').value;

        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        clearFormErrors('downloadModal');

        if (!format) {
            isValid = false;
            errorMessage = 'Please select a download format (PDF or CSV)';
            showFormError('downloadModal', 'format', errorMessage);
        }

        if (!batch) {
            isValid = false;
            errorMessage = 'Please select a batch to download';
            showFormError('downloadModal', 'batch', errorMessage);
        }

        return isValid;
    }

    function clearFormErrors(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const errorElements = modal.querySelectorAll('.error');
        const errorMessages = modal.querySelectorAll('.error-message');

        errorElements.forEach(el => el.classList.remove('error'));
        errorMessages.forEach(el => el.remove());
    }

    function showFormError(modalId, field, message) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const fieldElement = modal.querySelector(`[name="${field}"], #${field}`);
        if (fieldElement) {
            fieldElement.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '14px';
            errorDiv.style.marginTop = '4px';
            fieldElement.parentNode.appendChild(errorDiv);
        }
    }

    // Set up event listeners for download functionality
    function setupAPIEventListeners() {
        console.log('Setting up API download event listeners');

        // Set up the download confirm button
        const downloadConfirmBtn = document.getElementById('downloadConfirm');
        if (downloadConfirmBtn) {
            downloadConfirmBtn.addEventListener('click', window.handleDownloadConfirm);
        }

        // Set up card download triggers
        const cardDownload = document.getElementById('cardDownload');
        if (cardDownload) {
            cardDownload.addEventListener('click', () => window.openDownloadModal());
            
            cardDownload.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.openDownloadModal();
                }
            });
        }

        // Set up other download buttons
        const btnDownloadCodes = document.getElementById('btnDownloadCodes');
        if (btnDownloadCodes) {
            btnDownloadCodes.addEventListener('click', () => window.openDownloadModal());
        }

        const btnCodesDownload = document.getElementById('btnCodesDownload');
        if (btnCodesDownload) {
            btnCodesDownload.addEventListener('click', () => window.openDownloadModal());
        }

        console.log('API download event listeners setup complete');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAPIEventListeners);
    } else {
        setupAPIEventListeners();
    }

    console.log('Download API integration initialized successfully');

})();