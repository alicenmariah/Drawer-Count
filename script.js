document.addEventListener('DOMContentLoaded', function() {
    const amountInputs = document.querySelectorAll('.amount-input');
    const cashValues = document.querySelectorAll('.cash-value');
    const totalCell = document.querySelector('.total-cell');
    const varianceCell = document.querySelector('.variance-cell');
    const expectedInput = document.getElementById('expected-amount');
    const cashTakenInput = document.getElementById('cash-taken');
    const newDrawerInput = document.getElementById('new-drawer');
    const resetBtn = document.getElementById('reset-btn');
    const printBtn = document.getElementById('print-btn');
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
    
    // Print button
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Save button (using localStorage for demo)
    saveBtn.addEventListener('click', function() {
        const data = {
            amounts: Array.from(amountInputs).map(input => input.value),
            expected: expectedInput.value,
            cashTaken: cashTakenInput.value,
            newDrawer: newDrawerInput.value,
            date: new Date().toISOString()
        };
        
        const savedData = JSON.parse(localStorage.getItem('cashDrawerData') || '[]');
        savedData.push(data);
        localStorage.setItem('cashDrawerData', JSON.stringify(savedData));
        
        alert('Cash drawer count saved successfully!');
    });
}); 