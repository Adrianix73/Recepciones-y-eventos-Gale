(function () {
  function injectAdminConfirmModal() {
    if (document.getElementById("adminConfirmModal")) return;

    const modalHtml = `
      <div class="modal fade" id="adminConfirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content admin-confirm-modal">
            <div class="modal-header">
              <h5 class="modal-title" id="adminConfirmModalTitle">Confirmar acción</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
              <p id="adminConfirmModalMessage" class="mb-0">
                ¿Estás seguro de realizar esta acción?
              </p>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                id="adminConfirmModalCancel"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="btn btn-danger"
                id="adminConfirmModalConfirm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  window.injectAdminConfirmModal = injectAdminConfirmModal;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectAdminConfirmModal);
  } else {
    injectAdminConfirmModal();
  }
})();