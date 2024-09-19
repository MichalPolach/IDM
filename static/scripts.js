"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-btn");
  const form = document.forms.fr; // Assuming the form name is 'fr'
  const customFlashModal = document.getElementById("custom-flash-modal");

  // Full text truncation and popover setup
  const setupFullTextTruncation = () => {
    document.querySelectorAll('.fullText').forEach(element => {
      const fullText = element.textContent.trim();
      const words = fullText.split(' ');
      
      if (words.length > 5) {
        const truncatedText = words.slice(0, 4).join(' ') + '...';
        element.innerHTML = `${truncatedText}<span style="display:none;">${fullText}</span>`;
        element.setAttribute('data-bs-title', fullText);
        element.setAttribute('data-bs-toggle', 'popover');
        element.setAttribute('data-bs-trigger', 'hover');
      } else {
        element.removeAttribute('data-bs-toggle');
        element.removeAttribute('data-bs-trigger');
      }
    });

    // Initialize popovers (assuming Bootstrap is used)
    if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
      document.querySelectorAll('[data-bs-toggle="popover"]').forEach(popoverTrigger => {
        new bootstrap.Popover(popoverTrigger, {
          html: true,
          placement: 'bottom',
          title: ''
        });
      });
    } else {
      console.warn('Bootstrap Popover is not available. Make sure Bootstrap JS is properly loaded.');
    }
  };

  // Copyable text functionality
  const setupCopyableText = () => {
    document.querySelectorAll('.copyable').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const content = element.getAttribute('data-bs-content');
        if (!content) return;

        navigator.clipboard.writeText(content)
          .then(() => {
            console.log('Content copied to clipboard');
            alert('Content copied to clipboard!');
          })
          .catch(err => console.error('Failed to copy content:', err));
      });
    });
  };


  const validateForm = () => {
    const requiredInputs = document.querySelectorAll("input[required], select[required], textarea[required]");
    return Array.from(requiredInputs).every(input => input.value.trim() !== '');
  };

  const highlightEmptyFields = () => {
    const requiredInputs = document.querySelectorAll("input[required], select[required], textarea[required]");
    requiredInputs.forEach(input => {
      input.classList.toggle('is-invalid', input.value.trim() === '');
    });
  };

  const confirmFormSubmission = () => {
    if (confirm("Are you sure you want to submit the form?")) {
      form.submit();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      confirmFormSubmission();
    } else {
      highlightEmptyFields();
    }
  };

  if (submitButton && form) {
    submitButton.addEventListener("click", handleSubmit);
    form.addEventListener("submit", handleSubmit);
  }

  // Modal functionality
  const showModal = () => customFlashModal?.classList.add("show");
  const hideModal = () => customFlashModal?.classList.remove("show");

  if (document.querySelector(".custom-alert")) {
    showModal();
  }

  document.querySelectorAll(".custom-modal-close, .custom-modal-close-btn")
    .forEach(button => button.addEventListener("click", hideModal));

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-modal-content") && customFlashModal?.classList.contains("show")) {
      hideModal();
    }
  });

  // Remove is-invalid class on input
  document.addEventListener("input", (event) => {
    if (event.target.classList.contains("is-invalid") && event.target.value.trim() !== '') {
      event.target.classList.remove("is-invalid");
    }
  });

  setupFullTextTruncation();
  setupCopyableText()
});