(function () {
  let confirmHandler = null;

  function getModalElements() {
    const modalEl = document.getElementById("adminConfirmModal");
    if (!modalEl) return null;

    return {
      modalEl,
      titleEl: document.getElementById("adminConfirmModalTitle"),
      messageEl: document.getElementById("adminConfirmModalMessage"),
      confirmBtn: document.getElementById("adminConfirmModalConfirm"),
      cancelBtn: document.getElementById("adminConfirmModalCancel")
    };
  }

  function cleanupConfirmHandler() {
    const elements = getModalElements();
    if (!elements || !confirmHandler) return;

    elements.confirmBtn.removeEventListener("click", confirmHandler);
    confirmHandler = null;
  }

  function resetConfirmButton(confirmBtn) {
    confirmBtn.className = "btn btn-danger";
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Confirmar";
  }

  window.AdminModalManager = {
    confirm({
      title = "Confirmar acción",
      message = "¿Estás seguro de realizar esta acción?",
      confirmText = "Confirmar",
      confirmClass = "btn-danger",
      cancelText = "Cancelar",
      closeOnConfirm = true,
      onConfirm = async () => {}
    }) {
      if (typeof window.injectAdminConfirmModal === "function") {
        window.injectAdminConfirmModal();
      }

      const elements = getModalElements();
      if (!elements) {
        console.error("No se encontró el modal global de confirmación.");
        return;
      }

      const { modalEl, titleEl, messageEl, confirmBtn, cancelBtn } = elements;

      cleanupConfirmHandler();

      titleEl.textContent = title;
      messageEl.textContent = message;
      cancelBtn.textContent = cancelText;
      confirmBtn.textContent = confirmText;
      confirmBtn.className = `btn ${confirmClass}`;
      confirmBtn.disabled = false;

      confirmHandler = async () => {
        confirmBtn.disabled = true;

        try {
          await onConfirm();

          if (closeOnConfirm) {
            bootstrap.Modal.getOrCreateInstance(modalEl).hide();
          }
        } catch (error) {
          console.error(error);
        } finally {
          confirmBtn.disabled = false;
        }
      };

      confirmBtn.addEventListener("click", confirmHandler);
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.injectAdminConfirmModal === "function") {
      window.injectAdminConfirmModal();
    }

    const elements = getModalElements();
    if (!elements) return;

    elements.modalEl.addEventListener("hidden.bs.modal", () => {
      cleanupConfirmHandler();
      resetConfirmButton(elements.confirmBtn);

      elements.titleEl.textContent = "Confirmar acción";
      elements.messageEl.textContent = "¿Estás seguro de realizar esta acción?";
      elements.cancelBtn.textContent = "Cancelar";
    });
  });
})();