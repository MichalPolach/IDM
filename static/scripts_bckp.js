"use strict";

document.addEventListener("DOMContentLoaded", function() {
  const submitButton = document.getElementById("submit-btn");

  if (submitButton) {
    submitButton.addEventListener("click", function(event) {
      event.preventDefault();
      
      if (validateForm()) {
        confirmFormSubmission();
      } else {
        highlightEmptyFields();
      }
    });
  
    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        if (document.activeElement === submitButton) {
          event.preventDefault();
          
          if (validateForm()) {
            confirmFormSubmission();
          } else {
            highlightEmptyFields();
          }
        }
      }
    });
  }
});

function validateForm() {
  let requiredInputs = document.querySelectorAll("input[required]");

  if (requiredInputs) {
    for (let i = 0; i < requiredInputs.length; i++) {
      if (!requiredInputs[i].value.trim()) {
        return false;
      }
    }
    
    return true;
  }
}
  
function highlightEmptyFields() {
  let requiredInputs = document.querySelectorAll("input[required]");
  
  for (let i = 0; i < requiredInputs.length; i++) {
    if (!requiredInputs[i].value.trim()) {
      requiredInputs[i].classList.add("is-invalid");
    } else {
      requiredInputs[i].classList.remove("is-invalid");
    }
  }
}

function confirmFormSubmission() {
  if (confirm("Are you sure you want to submit the form?")) {
    document.fr.submit();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const alertElements = document.querySelectorAll(".custom-alert");
  if (alertElements.length > 0) {
    const customFlashModal = document.getElementById("custom-flash-modal");
    customFlashModal.classList.add("show");
  }

  const closeButtons = document.querySelectorAll(
    ".custom-modal-close, .custom-modal-close-btn"
  );
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const customFlashModal = document.getElementById("custom-flash-modal");
      customFlashModal.classList.remove("show");
    });
  });

  document.addEventListener("click", (event) => {
    const customFlashModal = document.getElementById("custom-flash-modal");
    if (!event.target.closest(".custom-modal-content") && customFlashModal.classList.contains("show")) {
      customFlashModal.classList.remove("show");
    }
  });
});