"use strict";

// // Event delegation for table rows
document.addEventListener('DOMContentLoaded', () => {

  // Form and submit button elements
  const form = document.getElementById('idform');
  const submitID = document.getElementById('submit-id-onclick');

  // Error handling for missing elements
  if (!form || !submitID) {
    console.error('Some form elements are missing - OK if on Archive page');
    return;
  }
  
  const setupTableRowClicks = () => {
    document.querySelectorAll('table tbody tr').forEach(row => {
      // Prevent click propagation for column 4 and 12
      const cellToIgnore = [row.children[4], row.children[12]];
    
      cellToIgnore.forEach(cell => {
        if (cell) {
          cell.addEventListener('click', event => {
            event.stopPropagation(); // Prevent the click event from affecting the row click
          });
        }
      });
    
      // Handle row clicks
      row.addEventListener('click', event => {
        const clickedRowId = row.children[0].textContent;
        const user = row.children[11].textContent;
        
        // Submit the form with the clicked row ID
        submitID.value = clickedRowId;
        form.submit();
      });
    });
  }

  // Dropdown filter functionality
  const setupDropdownFilter = () => {
    const select = document.getElementById("filter-dropdown");
    const table = document.getElementById("table-categories");
    if (!select || !table) {
      console.error('Dropdown filter elements are missing');
      return;
    }

    const rows = Array.from(table.getElementsByTagName("tr")).slice(1); // Skip header row
    const uniqueValues = new Set(["ALL"]);

    // Populate dropdown with unique values from column 9
    rows.forEach(row => {
      const cellValue = row.children[9]?.textContent?.trim();
      if (cellValue) uniqueValues.add(cellValue);
    });

    uniqueValues.forEach(value => {
      const option = document.createElement("option");
      option.text = value;
      select.add(option);
    });

    // Filter function
    select.addEventListener('change', () => {
      const filter = select.value.toUpperCase();
      rows.forEach(row => {
        const cellValue = row.children[9]?.textContent?.trim().toUpperCase();
        row.style.display = (filter === "ALL" || cellValue === filter) ? "" : "none";
      });
    });

    // Initial filter application
    select.dispatchEvent(new Event('change'));
  };

  setupDropdownFilter();
  setupTableRowClicks();
});