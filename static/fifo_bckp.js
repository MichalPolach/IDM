"use strict";

const form = document.getElementById('idform');
const submitID = document.getElementById('submit-id-onclick');

document.querySelector('table tbody').querySelectorAll('tr').forEach(row => {
  // Make the row clickable unless it's column 4 or 12
  const clickableRow = (row.children[12] || row.children[4]) ? row.children[12] ? row.children[12].parentNode : row.children[4].parentNode : row;

  if (row.children[12]) {
    row.children[12].addEventListener('click', event => {
      event.stopPropagation();
    });
  }

  if (row.children[4]) {
    row.children[4].addEventListener('click', event => {
      event.stopPropagation();
    });
  }

  clickableRow.addEventListener('click', event => {
    const clickedRowId = row.children[0].textContent;
    const user = row.children[11].textContent;
    console.log(clickedRowId);
    console.log(user);
      submitID.value = clickedRowId;
      console.log(submitID.value);
      form.submit();
  });
});


function confirmEditRecord() {
  if (confirm("Are you sure you want to submit the form?")) {
    document.fr.submit();
  }
}


window.onload = function() {
  const select = document.getElementById("filter-dropdown");
  const table = document.getElementById("table-categories");
  const tr = table.getElementsByTagName("tr");
  const uniqueValues = [];

  // Add an "ALL" option to the dropdown
  const allOption = document.createElement("option");
  allOption.text = "ALL";
  select.add(allOption);
    for (let i = 1; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName("td")[9];
      if (td) {
        const txtValue = td.textContent || td.innerText;
        if (!uniqueValues.includes(txtValue)) {
          uniqueValues.push(txtValue);
          const option = document.createElement("option");
          option.text = txtValue;
          select.add(option);
        }
      }
    }

  select.onchange = function() {
    const filter = this.value.toUpperCase();
    for (let i = 1; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName("td")[9];
      if (td) {
        const txtValue = td.textContent || td.innerText;
        if (filter === "ALL" || txtValue.toUpperCase() === filter) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  // Trigger the onchange event manually
  select.onchange();
}

$(document).ready(function(){
  $('.copyable').on('click', function(e) {
    e.preventDefault(); // Prevent any default click behavior
    
    const content = $(this).attr('data-bs-content');
    
    // Create a temporary textarea element to hold the text
    const tempTextArea = $('<textarea>');
    $('body').append(tempTextArea);
    tempTextArea.val(content).select();
    
    try {
        // Execute the copy command
        document.execCommand('copy');
        console.log('Content copied to clipboard');
        
        // Optional: Provide user feedback
        alert('Content copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy content: ', err);
    } finally {
        // Remove the temporary textarea
        tempTextArea.remove();
    }
  });

  $('.fullText').each(function() {
      const $this = $(this);
      const fullText = $this.text().trim();
      const words = fullText.split(' ');
      
      if (words.length > 5) {
          const truncatedText = words.slice(0, 4).join(' ') + '...';
          $this.html(truncatedText + '<span style="display:none;">' + fullText + '</span>');
          $this.attr('data-bs-title', fullText);
          $this.attr('data-bs-toggle', 'popover');
          $this.attr('data-bs-trigger', 'hover');
      } else {
          $this.removeAttr('data-bs-toggle');
          $this.removeAttr('data-bs-trigger');
      }
  });

  $('[data-bs-toggle="popover"]').popover({
      html: true,
      placement: 'bottom',
      title: function() {
          return $(this).attr('data-bs-title') || $(this).text();
      }
  });
});

console.log(result.value);