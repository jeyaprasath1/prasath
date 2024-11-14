        // Initialize localStorage for drug inventory and supplier details
        let drugs = JSON.parse(localStorage.getItem('drugs')) || [];
        let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];

        // Function to handle adding a new drug
        function addDrug(event) {
            event.preventDefault(); // Prevent form submission

            const drugName = document.getElementById('drug-name').value;
            const drugCode = document.getElementById('drug-code').value;
            const quantity = document.getElementById('quantity').value;
            const price = document.getElementById('price').value;
            const expiryDate = document.getElementById('expiry-date').value;

            if (!drugName || !drugCode || !quantity || !price || !expiryDate) {
                alert("Please fill in all fields!");
                return;
            }

            const newDrug = {
                name: drugName,
                code: drugCode,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                expiry: expiryDate
            };

            // Add new drug to drugs array
            drugs.push(newDrug);

            // Save drugs array to localStorage
            localStorage.setItem('drugs', JSON.stringify(drugs));

            // Reset the form
            document.getElementById('add-drug-form').reset();

            // Display the updated inventory
            displayInventory();
        }

        // Function to handle adding a new supplier
        function addSupplier(event) {
            event.preventDefault(); // Prevent form submission

            const supplierName = document.getElementById('supplier-name').value;
            const contactInfo = document.getElementById('contact-info').value;

            if (!supplierName || !contactInfo) {
                alert("Please fill in all fields!");
                return;
            }

            const newSupplier = {
                name: supplierName,
                contact: contactInfo
            };

            // Add new supplier to suppliers array
            suppliers.push(newSupplier);

            // Save suppliers array to localStorage
            localStorage.setItem('suppliers', JSON.stringify(suppliers));

            // Reset the form
            document.getElementById('add-supplier-form').reset();

            // Display the updated supplier list
            displaySuppliers();
        }

        // Function to display the inventory
        function displayInventory() {
            const inventoryTableBody = document.querySelector('#inventory-table tbody');
            inventoryTableBody.innerHTML = ''; // Clear existing rows

            // Populate the table with the drug inventory
            drugs.forEach((drug, index) => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = drug.name;

                const codeCell = document.createElement('td');
                codeCell.textContent = drug.code;

                const quantityCell = document.createElement('td');
                quantityCell.textContent = drug.quantity;

                const priceCell = document.createElement('td');
                priceCell.textContent = `$${drug.price.toFixed(2)}`;

                const expiryCell = document.createElement('td');
                expiryCell.textContent = drug.expiry;

                const actionCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteDrug(index);
                actionCell.appendChild(deleteButton);

                row.appendChild(nameCell);
                row.appendChild(codeCell);
                row.appendChild(quantityCell);
                row.appendChild(priceCell);
                row.appendChild(expiryCell);
                row.appendChild(actionCell);

                inventoryTableBody.appendChild(row);
            });
        }

        // Function to display the suppliers
        function displaySuppliers() {
            const supplierTableBody = document.querySelector('#supplier-table tbody');
            supplierTableBody.innerHTML = ''; // Clear existing rows

            // Populate the table with the supplier data
            suppliers.forEach((supplier, index) => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = supplier.name;

                const contactCell = document.createElement('td');
                contactCell.textContent = supplier.contact;

                const actionCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteSupplier(index);
                actionCell.appendChild(deleteButton);

                row.appendChild(nameCell);
                row.appendChild(contactCell);
                row.appendChild(actionCell);

                supplierTableBody.appendChild(row);
            });
        }

        // Function to delete a drug
        function deleteDrug(index) {
            drugs.splice(index, 1); // Remove drug from array
            localStorage.setItem('drugs', JSON.stringify(drugs)); // Update localStorage
            displayInventory(); // Re-render the inventory table
        }

        // Function to delete a supplier
        function deleteSupplier(index) {
            suppliers.splice(index, 1); // Remove supplier from array
            localStorage.setItem('suppliers', JSON.stringify(suppliers)); // Update localStorage
            displaySuppliers(); // Re-render the supplier table
        }

        // Event listeners
        document.getElementById('add-drug-form').addEventListener('submit', addDrug);
        document.getElementById('add-supplier-form').addEventListener('submit', addSupplier);

        // Initial rendering of data
        displayInventory();
        displaySuppliers();