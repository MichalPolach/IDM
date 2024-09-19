"use strict";

// DOM elements
const elements = {
  currentLocation: document.getElementById('current-location'),
  currentPosition: document.getElementById('current-position'),
  currentShelf: document.getElementById('current-shelf'),
  nextLocation: document.getElementById('next-location'),
  nextPosition: document.getElementById('next-position'),
  nextShelf: document.getElementById('next-shelf'),
  result: document.getElementById('result'),
  okButton: document.getElementById('okButton'),
  userSelect: document.getElementById('userSelect'),
  userForm: document.getElementById('userForm')
};

// Utility functions
const createOption = (text, value = text) => {
  const option = document.createElement('option');
  option.text = text;
  option.value = value;
  return option;
};

// Function to set styles on an element
const setStyles = (element, styles) => {
  Object.assign(element.style, styles);
};

// Function to load options into a dropdown
const loadOptions = (options, selectedOption, dropdown) => {
  dropdown.innerHTML = '';
  options[selectedOption]?.forEach(value => dropdown.add(createOption(value)));
};

// Function to trigger change of element on change event
const triggerChangeEvent = (element) => {
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

// Initialize result dropdown
const initializeResultDropdown = () => {
  const { result, currentLocation } = elements;
  result.innerHTML = '';

  if (['FAIL STORAGE', 'PASS STORAGE'].includes(currentLocation.value)) {
    result.add(createOption('CLOSED'));
    setStyles(result.options[result.options.length - 1], { fontWeight: 'bolder', color: 'blue' });
  } else {
    ['PASS', 'FAIL'].forEach(value => {
      const option = createOption(value);
      result.add(option);
      setStyles(option, {
        fontWeight: 'bolder',
        backgroundColor: value === 'PASS' ? 'lime' : 'red'
      });
    });

    result.addEventListener('change', () => {
      setStyles(result, {
        backgroundColor: result.value === 'PASS' ? 'lime' : result.value === 'FAIL' ? 'red' : '',
        fontWeight: ['PASS', 'FAIL'].includes(result.value) ? 'bold' : 'normal'
      });
    });
  }
};

// Fetch config and set up event listeners
const setupFlowLogic = async () => {
  try {
    const response = await fetch('/static/config/config.json');
    const data = await response.json();
    const { flow_pass, flow_fail, flow_closed, positions_for_locations, storage } = data;

    elements.result.addEventListener('change', () => {
      const flow = elements.result.value === 'PASS' ? flow_pass :
                   elements.result.value === 'CLOSED' ? flow_closed : flow_fail;
      loadOptions(flow, elements.currentLocation.value, elements.nextLocation);
      triggerChangeEvent(elements.nextLocation);
    });

    elements.nextLocation.addEventListener('change', () => {
      loadOptions(positions_for_locations, elements.nextLocation.value, elements.nextPosition);
      triggerChangeEvent(elements.nextPosition);
    });

    elements.nextPosition.addEventListener('change', () => {
      loadOptions(storage, elements.nextPosition.value, elements.nextShelf);
    });

    triggerChangeEvent(elements.result);
  } catch (error) {
    console.error('Error fetching config:', error);
  }
};

// Table row click handling
const setupTableRowClicks = () => {
  document.querySelectorAll('table tr').forEach(row => {
    const clickableRow = row.children[12] || row.children[4] ?
      (row.children[12] ? row.children[12].parentNode : row.children[4].parentNode) : row;

    clickableRow.addEventListener('click', function() {
      const url = this.getAttribute('data-href');
      if (url) window.location.href = url;
    });

    [12, 4].forEach(index => {
      if (row.children[index]) {
        row.children[index].addEventListener('click', event => event.stopPropagation());
      }
    });
  });
};

// Event listener for OK button
const setupOkButton = () => {
  elements.okButton.addEventListener('click', () => {
    console.log(elements.userSelect.value);
    elements.userForm.submit();
  });
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeResultDropdown();
  setupFlowLogic();
  setupTableRowClicks();
  setupOkButton();
});