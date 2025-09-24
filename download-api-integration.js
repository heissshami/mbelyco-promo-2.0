// Download API Integration - Overrides download functionality to use serverless functions
// This script should be loaded after app.js to override existing functionality

(function() {
    'use strict';

    // Store original functions for potential fallback
    const originalOpenDownloadModal = window.openDownloadModal;
    const originalHandleDownloadConfirm = window.handleDownloadConfirm;
    const originalDownloadCSV = window.downloadCSV;
    const originalDownloadPDF = window.downloadPDF;
    const originalDownloadCodesWithProgress = window.downloadCodesWithProgress;

    // Override openDownloadModal to use our API version
    window.openDownloadModal = function(batchId) {
        console.log('Using API version of openDownloadModal');
        
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
            // Fallback to original function if modal system not available
            originalOpenDownloadModal && originalOpenDownloadModal(batchId);
        }
    };

    // Override handleDownloadConfirm to use API
    window.handleDownloadConfirm = async function() {
        console.log('Using API version of handleDownloadConfirm');
        
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
            
            // Fallback to original download methods if API fails
            console.log('Falling back to original download methods');
            if (format === 'csv' && originalDownloadCSV) {
                originalDownloadCSV(batch);
            } else if (format === 'pdf' && originalDownloadPDF) {
                originalDownloadPDF(batch);
            }
            
            if (window.toast) {
                window.toast('Download completed with fallback method', 'info');
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

    // Set up event listeners to override the original ones
    function setupAPIEventListeners() {
        console.log('Setting up API download event listeners');

        // Override the download confirm button
        const downloadConfirmBtn = document.getElementById('downloadConfirm');
        if (downloadConfirmBtn) {
            downloadConfirmBtn.removeEventListener('click', originalHandleDownloadConfirm);
            downloadConfirmBtn.addEventListener('click', window.handleDownloadConfirm);
        }

        // Override card download triggers
        const cardDownload = document.getElementById('cardDownload');
        if (cardDownload) {
            cardDownload.removeEventListener('click', () => originalOpenDownloadModal());
            cardDownload.addEventListener('click', () => window.openDownloadModal());
            
            cardDownload.removeEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    originalOpenDownloadModal();
                }
            });
            
            cardDownload.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.openDownloadModal();
                }
            });
        }

        // Override other download buttons
        const btnDownloadCodes = document.getElementById('btnDownloadCodes');
        if (btnDownloadCodes) {
            btnDownloadCodes.removeEventListener('click', () => originalOpenDownloadModal());
            btnDownloadCodes.addEventListener('click', () => window.openDownloadModal());
        }

        const btnCodesDownload = document.getElementById('btnCodesDownload');
        if (btnCodesDownload) {
            btnCodesDownload.removeEventListener('click', () => originalOpenDownloadModal());
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

    console.log('Download API integration loaded successfully');

})();