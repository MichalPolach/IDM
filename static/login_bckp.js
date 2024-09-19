"use strict";

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

  revealBtn.addEventListener('click', () => {
    const passwordInput = document.getElementById('pswd');
    const showHideLabel = document.getElementById('showHideLabel');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      showHideLabel.textContent = 'Hide password';
    } else {
      passwordInput.type = 'password';
      showHideLabel.textContent = 'Show password';
    }
  });

});
