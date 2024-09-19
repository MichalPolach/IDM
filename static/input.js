"use strict";

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // DOM elements - get the values of the dropdowns
  const elements = {
    position: document.getElementById('location'),
    shelf: document.getElementById('shelf'),
  };

  // Function to load options into a dropdown
  const loadOptions = (options, selectedOption, dropdown) => {
    const optionValues = options[selectedOption] || [];
    dropdown.innerHTML = '';
    optionValues.forEach(value => {
      const option = document.createElement('option');
      option.text = value;
      dropdown.appendChild(option);
    });
  };

  // Function to trigger change of element on change event
  const triggerChangeEvent = (element) => {
    element.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // Fetch config and populate dropdowns
  const setupFlowLogic = async () => {
    try {
      const response = await fetch('/static/config/config.json');
      const data = await response.json();
      const { storage } = data;

      elements.position.addEventListener('change', () => {
        loadOptions(storage, elements.position.value, elements.shelf);
      });

      triggerChangeEvent(elements.position);

    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  // Call the setupFlowLogic function
  setupFlowLogic();
});