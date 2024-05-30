document.getElementById('spendingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;

    fetch('/add-spending', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, amount, date })
    })
    .then(response => response.json())
    .then(data => {
        if (data.name) {
            // alert('Spending record added!');
            loadSpendings();
        } else {
            alert(data);
        }
    });
});

function deleteSpending(id) {
    fetch(`/delete-spending/${id}`, { // Include the ID in the URL
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // alert(data);
        loadSpendings();
    })
    .catch(error => {
        console.error('Error deleting spending record:', error);
        alert('Error deleting spending record');
    });
}

// Function to format the date to remove the timestamp
function formatDate(dateString) {
    const date = new Date(dateString);
    // Format the date as desired, for example: "YYYY-MM-DD"
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return formattedDate;
}

// Modify the loadSpendings function to format the date before rendering

// Modify the loadSpendings function to calculate the total amount and display it
function loadSpendings() {
    fetch('/get-spendings')
    .then(response => response.json())
    .then(data => {
        const spendingList = document.getElementById('spendingList');
        spendingList.innerHTML = '';

        // Initialize total amount
        let totalAmount = 0;
        
        const table = document.createElement('table');
        table.classList.add('spendingTable');
        
        const headerRow = table.insertRow();
        const headers = ['Name', 'Amount', 'Date', 'Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        data.forEach(record => {
            const row = table.insertRow();
            const formattedDate = formatDate(record.date);

            const nameCell = row.insertCell();
            nameCell.textContent = record.name;

            const amountCell = row.insertCell();
            amountCell.textContent = record.amount;
            // Add the amount to the total
            totalAmount += parseFloat(record.amount);

            const dateCell = row.insertCell();
            dateCell.textContent = formattedDate;

            const actionCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('deleteButton');
            deleteButton.addEventListener('click', () => deleteSpending(record.id));
            actionCell.appendChild(deleteButton);
        });

        spendingList.appendChild(table);

        // Display the total amount
        const totalElement = document.createElement('p');
        totalElement.textContent = `Total Amount: ${totalAmount.toFixed(2)}`; // Displaying the total with 2 decimal places
        spendingList.appendChild(totalElement);
    });
}

loadSpendings();
