// UI MODULES - MODAL, TOAST

const MODAL = {
  open(titleOrId, content = null) {
    // Si content existe, es modal dinámico (nuevo sistema)
    if (content !== null) {
      return this.openDynamic(titleOrId, content);
    }
    // Si no, es modal fijo (viejo sistema)
    const elem = document.getElementById(titleOrId);
    if (elem) {
      elem.classList.add('active');
    }
  },

  openDynamic(title, html) {
    // Crear o reutilizar overlay dinámico
    let overlay = document.getElementById('dynamicModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'dynamicModalOverlay';
      overlay.className = 'modal-overlay active';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;';
      document.body.appendChild(overlay);

      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeDynamic();
      });
    }

    // Crear modal
    let modal = overlay.querySelector('.modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.cssText = 'background: #1a1a2e; color: #fff; border-radius: 8px; padding: 0; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.3);';
      overlay.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #444;">
        <h3 style="margin: 0; font-size: 1.3em;">${title}</h3>
        <button class="modal-close" onclick="MODAL.closeDynamic()" style="background: none; border: none; color: #fff; font-size: 1.5em; cursor: pointer;">✕</button>
      </div>
      <div class="modal-body" style="padding: 20px;">
        ${html}
      </div>
    `;

    overlay.classList.add('active');
  },

  closeDynamic() {
    const overlay = document.getElementById('dynamicModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
  },

  close(idOrNothing = null) {
    // Si es modal dinámico
    if (idOrNothing === undefined || idOrNothing === null) {
      return this.closeDynamic();
    }
    // Si es modal fijo
    const elem = document.getElementById(idOrNothing);
    if (elem) {
      elem.classList.remove('active');
    }
  },

  init() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.addEventListener('click', e => {
        if (e.target === m) this.close(m.id);
      });
    });
  }
};

const TOAST = {
  show(icon, msg) {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${icon}</span>${msg}`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
};

// Init modals
document.addEventListener('DOMContentLoaded', () => MODAL.init());
