// Import API Integration Script
// Overrides import functionality to use serverless API endpoints

(function() {
    'use strict';

    // Store original functions for fallback
    const originalHandleImportFile = window.handleImportFile;
    const originalImportCodesWithProgress = window.importCodesWithProgress;
    const originalImportSettings = window.importSettings;

    // Helper function to show toast messages
    function showToast(message, type = 'info') {
        if (window.toast) {
            window.toast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Helper function to get element by ID
    function el(id) {
        return document.getElementById(id);
    }

    // Override handleImportFile to use API
    window.handleImportFile = async function(file) {
        try {
            showToast('Starting import process...', 'info');

            // Read file content
            const text = await file.text();
            const fileName = file.name;

            // Get import options from the form
            const skipDuplicates = el('skipDuplicates')?.checked || false;
            const validateFormat = el('validateFormat')?.checked || false;
            const sendNotifications = el('sendNotifications')?.checked || false;

            // Call the serverless API
            const response = await fetch('/api/import-codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: text,
                    fileName: fileName,
                    importType: 'csv',
                    options: {
                        skipDuplicates,
                        validateFormat,
                        sendNotifications
                    }
                })
            });

            const result = await response.json();

            if (response.ok) {
                showToast(result.message, 'success');
                
                // Refresh the UI if needed
                if (window.renderBatches && window.renderCodes) {
                    window.renderBatches(el('batchSearch')?.value || '');
                    window.renderCodes(el('codesSearch')?.value || '', window.getActiveStatus?.() || 'all');
                }
                
                // Close import modal if it exists
                const importModal = el('importModal');
                if (importModal && window.Modal) {
                    const modalInstance = Modal.getInstance(importModal);
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }
                
                // Reset file input
                const importFileInput = el('importFile');
                if (importFileInput) {
                    importFileInput.value = '';
                }
                
            } else {
                showToast(result.error || 'Import failed', 'error');
                console.error('Import error:', result);
            }

        } catch (error) {
            console.error('Import API error:', error);
            showToast('Failed to connect to import service', 'error');
            
            // Fallback to original function if API fails
            if (originalHandleImportFile) {
                showToast('Falling back to local import...', 'warning');
                return originalHandleImportFile.call(this, file);
            }
        }
    };

    // Override importCodesWithProgress to use API with progress simulation
    window.importCodesWithProgress = async function(file, options = {}) {
        try {
            const progressModal = el('importProgressModal');
            const progressBar = el('importProgressBar');
            const progressText = el('importProgressText');
            const cancelImportBtn = el('cancelImportBtn');

            // Show progress modal
            if (progressModal && window.Modal) {
                const modalInstance = Modal.getInstance(progressModal) || new Modal(progressModal);
                modalInstance.show();
            }

            // Set up cancellation
            let cancelled = false;
            if (cancelImportBtn) {
                cancelImportBtn.onclick = () => {
                    cancelled = true;
                    if (progressModal && window.Modal) {
                        const modalInstance = Modal.getInstance(progressModal);
                        if (modalInstance) {
                            modalInstance.close();
                        }
                    }
                    showToast('Import cancelled', 'warning');
                };
            }

            // Simulate progress (0-70%)
            for (let i = 0; i <= 70; i += 10) {
                if (cancelled) break;
                
                if (progressBar) progressBar.style.width = i + '%';
                if (progressText) progressText.textContent = `Processing file... ${i}%`;
                
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (cancelled) return;

            // Read file and prepare for API call
            const text = await file.text();
            const fileName = file.name;

            // Update progress
            if (progressBar) progressBar.style.width = '80%';
            if (progressText) progressText.textContent = 'Uploading to server...';

            // Call the API
            const response = await fetch('/api/import-codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: text,
                    fileName: fileName,
                    importType: 'csv',
                    options: {
                        skipDuplicates: options.skipDuplicates || false,
                        validateFormat: options.validateFormat || false,
                        sendNotifications: options.sendNotifications || false
                    }
                })
            });

            const result = await response.json();

            if (cancelled) return;

            if (response.ok) {
                // Complete progress
                if (progressBar) progressBar.style.width = '100%';
                if (progressText) progressText.textContent = 'Import completed!';

                await new Promise(resolve => setTimeout(resolve, 500));

                // Close progress modal
                if (progressModal && window.Modal) {
                    const modalInstance = Modal.getInstance(progressModal);
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }

                showToast(result.message, 'success');

                // Refresh UI
                if (window.renderBatches && window.renderCodes) {
                    window.renderBatches(el('batchSearch')?.value || '');
                    window.renderCodes(el('codesSearch')?.value || '', window.getActiveStatus?.() || 'all');
                }

            } else {
                throw new Error(result.error || 'Import failed');
            }

        } catch (error) {
            console.error('Import with progress error:', error);
            
            // Close progress modal
            const progressModal = el('importProgressModal');
            if (progressModal && window.Modal) {
                const modalInstance = Modal.getInstance(progressModal);
                if (modalInstance) {
                    modalInstance.close();
                }
            }

            showToast(error.message || 'Import failed', 'error');
            
            // Fallback to original function
            if (originalImportCodesWithProgress) {
                showToast('Falling back to local import...', 'warning');
                return originalImportCodesWithProgress.call(this, file, options);
            }
        }
    };

    // Override importSettings to use API
    window.importSettings = async function(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const text = await file.text();
            const fileName = file.name;

            // Call the settings import API
            const response = await fetch('/api/import-codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: text,
                    fileName: fileName,
                    importType: 'settings'
                })
            });

            const result = await response.json();

            if (response.ok) {
                showToast(result.message, 'success');
                
                // Reload settings if needed
                if (window.loadSettings) {
                    window.loadSettings();
                }
                
            } else {
                showToast(result.error || 'Settings import failed', 'error');
            }

            // Reset file input
            event.target.value = '';

        } catch (error) {
            console.error('Settings import API error:', error);
            showToast('Failed to connect to settings service', 'error');
            
            // Fallback to original function
            if (originalImportSettings) {
                return originalImportSettings.call(this, event);
            }
        }
    };

    // Set up event listeners to override existing ones
    document.addEventListener('DOMContentLoaded', function() {
        // Override import file input change event
        const importFileInput = el('importFile');
        if (importFileInput) {
            importFileInput.removeEventListener('change', originalHandleImportFile);
            importFileInput.addEventListener('change', window.handleImportFile);
        }

        // Override import settings input change event
        const importSettingsInput = el('importSettings');
        if (importSettingsInput) {
            importSettingsInput.removeEventListener('change', originalImportSettings);
            importSettingsInput.addEventListener('change', window.importSettings);
        }

        // Override import button in modal
        const importBtn = el('importBtn');
        if (importBtn) {
            importBtn.onclick = function() {
                const fileInput = el('importFileModal');
                if (fileInput && fileInput.files.length > 0) {
                    window.importCodesWithProgress(fileInput.files[0], {
                        skipDuplicates: el('skipDuplicates')?.checked || false,
                        validateFormat: el('validateFormat')?.checked || false,
                        sendNotifications: el('sendNotifications')?.checked || false
                    });
                } else {
                    showToast('Please select a file to import', 'error');
                }
            };
        }

        // Override drag and drop functionality
        const importDrop = el('importDrop');
        if (importDrop) {
            importDrop.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            importDrop.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
            });

            importDrop.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const fileInput = el('importFileModal');
                    if (fileInput) {
                        // Create a new FileList-like object
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(files[0]);
                        fileInput.files = dataTransfer.files;
                        
                        // Trigger import
                        window.importCodesWithProgress(files[0], {
                            skipDuplicates: el('skipDuplicates')?.checked || false,
                            validateFormat: el('validateFormat')?.checked || false,
                            sendNotifications: el('sendNotifications')?.checked || false
                        });
                    }
                }
            });
        }

        showToast('Import API integration loaded successfully', 'success');
    });

    console.log('Import API integration script loaded');

})();