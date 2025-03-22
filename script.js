document.addEventListener('DOMContentLoaded', function() {
    const amountInputs = document.querySelectorAll('.amount-input');
    const cashValues = document.querySelectorAll('.cash-value');
    const totalCell = document.querySelector('.total-cell');
    const varianceCell = document.querySelector('.variance-cell');
    const expectedInput = document.getElementById('expected-amount');
    const cashTakenInput = document.getElementById('cash-taken');
    const newDrawerInput = document.getElementById('new-drawer');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + parseFloat(amount).toFixed(2);
    }
    
    // Calculate cash values and total
    function calculateValues() {
        let total = 0;
        
        amountInputs.forEach((input, index) => {
            const amount = input.value || 0;
            const value = parseFloat(input.dataset.value);
            const cashValue = amount * value;
            
            cashValues[index].textContent = formatCurrency(cashValue);
            total += cashValue;
        });
        
        totalCell.textContent = formatCurrency(total);
        
        // Calculate variance
        const expected = parseFloat(expectedInput.value || 0);
        const variance = total - expected;
        varianceCell.textContent = formatCurrency(variance);
        
        // Set color for variance (dark mode colors)
        if (variance < 0) {
            varianceCell.style.backgroundColor = '#4a1c24';
            varianceCell.style.color = '#f88e99';
        } else if (variance > 0) {
            varianceCell.style.backgroundColor = '#4d3800';
            varianceCell.style.color = '#ffd54f';
        } else {
            varianceCell.style.backgroundColor = '#1e4620';
            varianceCell.style.color = '#4caf50';
        }
    }
    
    // Add event listeners to all inputs
    amountInputs.forEach(input => {
        input.addEventListener('input', calculateValues);
    });
    
    expectedInput.addEventListener('input', calculateValues);
    cashTakenInput.addEventListener('input', calculateValues);
    newDrawerInput.addEventListener('input', calculateValues);
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all values?')) {
            amountInputs.forEach(input => {
                input.value = '';
            });
            expectedInput.value = '';
            cashTakenInput.value = '';
            newDrawerInput.value = '';
            calculateValues();
        }
    });
    
    // Helper function to generate CSV content
    function generateCSV() {
        const headers = ['Denomination', 'Count', 'Value'];
        const rows = [];
        
        // Add all cash counts
        amountInputs.forEach((input, index) => {
            const denomination = input.closest('tr').cells[0].textContent;
            const count = input.value || '0';
            const value = cashValues[index].textContent;
            rows.push([denomination, count, value]);
        });
        
        // Add summary rows
        rows.push(
            ['', '', ''],
            ['Total in drawer', '', totalCell.textContent],
            ['Expected amount', '', formatCurrency(expectedInput.value || 0)],
            ['Variance', '', varianceCell.textContent],
            ['Cash Taken', '', formatCurrency(cashTakenInput.value || 0)],
            ['New Drawer', '', formatCurrency(newDrawerInput.value || 0)],
            ['Date', '', new Date().toLocaleString()]
        );
        
        // Convert to CSV format
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
            
        return csvContent;
    }

    // Replace the save button functionality
    saveBtn.addEventListener('click', function() {
        const saveOptions = document.createElement('div');
        saveOptions.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: #2c2c2c; padding: 20px; border-radius: 8px; z-index: 1000;
                        border: 1px solid #444; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                <h3 style="margin-bottom: 15px;">Save As:</h3>
                <button id="csv-btn" style="width: 100%; margin-bottom: 10px;">CSV (for Google Sheets)</button>
                <button id="pdf-btn" style="width: 100%; margin-bottom: 10px;">PDF</button>
                <button id="cancel-btn" style="width: 100%;">Cancel</button>
            </div>
        `;
        document.body.appendChild(saveOptions);

        // CSV download
        document.getElementById('csv-btn').addEventListener('click', function() {
            const csvContent = generateCSV();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().split('T')[0];
            link.href = URL.createObjectURL(blob);
            link.download = `cash_drawer_count_${timestamp}.csv`;
            link.click();
            document.body.removeChild(saveOptions);
        });

        // PDF download (uses existing print functionality)
        document.getElementById('pdf-btn').addEventListener('click', function() {
            document.body.removeChild(saveOptions);
            window.print();  // Most browsers will allow saving as PDF when printing
        });

        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', function() {
            document.body.removeChild(saveOptions);
        });
    });
}); 