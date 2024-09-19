"use strict";

const current_location = document.getElementById('current-location');
const current_position = document.getElementById('current-position');
const current_shelf = document.getElementById('current-shelf');
const next_location = document.getElementById('next-location');
const next_position = document.getElementById('next-position');
const next_shelf = document.getElementById('next-shelf');
const result = document.getElementById('result');

$(document).ready(function() {
  if (current_location.value === 'FAIL STORAGE' || current_location.value === 'PASS STORAGE') {
    result.innerHTML = '';
    const option = document.createElement('option');
    option.text = 'CLOSED';
    $('#result option[value="CLOSED"]').css({ 'font-weight': 'bolder', color: 'blue' });
    result.add(option);

  } else {
    result.innerHTML = '';
    const option1 = document.createElement('option');
    option1.value = 'PASS';
    option1.text = 'PASS';
    result.add(option1);

    const option2 = document.createElement('option');
    option2.value = 'FAIL';
    option2.text = 'FAIL';
    result.add(option2);

    $('#result option[value="PASS"]').css({ 'font-weight': 'bolder', 'background-color': 'lime' });
    $('#result option[value="FAIL"]').css({ 'font-weight': 'bolder', 'background-color': 'red' });

    $('#result').on('change', function() {
      const selectedValue = $(this).val();
      if (selectedValue === 'PASS') {
        $(this).css({
          'background-color': 'lime',
          'font-weight': 'bold'
        });
      } else if (selectedValue === 'FAIL') {
        $(this).css({
          'background-color': 'red',
          'font-weight': 'bold'
        });
      } else {
        $(this).css({
          'background-color': '',
          'font-weight': 'normal'
        }); // Default styles if needed
      }
    });
  }
});


function loadOptions(options, selectedOption, dropdown) {
  const optionValues = options[selectedOption];
  optionValues.forEach(function(value) {
    const option = document.createElement('option');
    option.text = value;
    dropdown.add(option);
  })
};

fetch('/static/config.json')
.then(response => response.json())
.then(data => {
  const pass_flow = data['flow_pass'];
  const fail_flow = data['flow_fail'];
  const closed_flow = data['flow_closed'];
  const positions_for_locations = data['positions_for_locations'];
  const positions = data['storage'];
  
  result.addEventListener('change', function(){
    const selectedOption = result.value;
    if (selectedOption === 'PASS') {
      next_location.innerHTML = '';
      loadOptions(pass_flow, current_location.value, next_location);
    } else if (selectedOption === 'CLOSED') {
      next_location.innerHTML = '';
      loadOptions(closed_flow, current_location.value, next_location);
    } else {
      next_location.innerHTML = '';
      loadOptions(fail_flow, current_location.value, next_location);
    }
    triggerChangeEvent(next_location);
  });
  
  next_location.addEventListener('change', function() {
    const selectedOption = next_location.value;
    next_position.innerHTML = '';
    loadOptions(positions_for_locations, selectedOption, next_position);
    triggerChangeEvent(next_position);
  });

  next_position.addEventListener('change', function() {
    const selectedOption = next_position.value;
    next_shelf.innerHTML = '';
    loadOptions(positions, selectedOption, next_shelf);
  });

  function triggerChangeEvent(dropdown) {
    if ('createEvent' in document) {
      const event = new Event('change', { bubbles: true });
      dropdown.dispatchEvent(event);
    } else {
      const event = document.createEvent('Event');
      event.initEvent('change', true, true);
      dropdown.dispatchEvent(event);
    }
  }

  triggerChangeEvent(result);
})

document.querySelectorAll('table tr').forEach(row => {
  // Make the row clickable unless it's column 4 or 12
  const clickableRow = (row.children[12] || row.children[4]) ? row.children[12] ? row.children[12].parentNode : row.children[4].parentNode : row;

  clickableRow.addEventListener('click', function() {
    const url = this.getAttribute('data-href');
    if (url) {
      navigateToUrl(url);
    }
  });

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
});

function navigateToUrl(url) {
  window.location.href = url;
};

document.getElementById('okButton').addEventListener('click', function() {
  const selectedUser = document.getElementById('userSelect').value;
  console.log(selectedUser);
  document.getElementById('userForm').submit();
});

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
