

const MODAL = {
  open(titleOrId, content = null) {
    
    if (content !== null) {
      return this.openDynamic(titleOrId, content);
    }
    
    const elem = document.getElementById(titleOrId);
    if (elem) {
      elem.classList.add('active');
    }
  },

  openDynamic(title, html) {
    
    let overlay = document.getElementById('dynamicModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'dynamicModalOverlay';
      overlay.className = 'modal-overlay active';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(26, 26, 24, 0.35); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 9999;';
      document.body.appendChild(overlay);

      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeDynamic();
      });
    } else {
      overlay.style.display = 'flex';
    }

    
    let modal = overlay.querySelector('.modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.cssText = 'background: var(--surface); color: var(--text-primary); border-radius: var(--radius-lg); padding: 0; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); border: 1px solid var(--border);';
      overlay.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border-light);">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${title}</h3>
        <button class="modal-close" onclick="MODAL.closeDynamic()" style="background: var(--surface-alt); border: none; color: var(--text-secondary); width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: all 0.15s;">✕</button>
      </div>
      <div class="modal-body" style="padding: 20px 24px;">
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

  confirm(message, onConfirm) {
    let overlay = document.getElementById('confirmModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'confirmModalOverlay';
      overlay.className = 'modal-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(26, 26, 24, 0.35); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 10000;';
      document.body.appendChild(overlay);
      
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeConfirm();
      });
    }

    overlay.innerHTML = `
      <div class="modal confirm-modal" style="width: 400px; max-width: 90vw; border-radius: 12px; overflow: hidden; background: var(--surface); box-shadow: var(--shadow-lg); border: 1px solid var(--border); animation: fadeUp 0.25s ease;">
        <div class="modal-body" style="padding: 24px; text-align: center;">
          <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
          <h4 style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">¿Confirmar Acción?</h4>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0;">${message}</p>
        </div>
        <div class="modal-footer" style="background: var(--surface-alt); padding: 14px 20px; display: flex; justify-content: center; gap: 12px; border-top: 1px solid var(--border-light);">
          <button id="confirmBtnCancel" class="btn btn-secondary btn-sm" style="min-width: 90px;">Cancelar</button>
          <button id="confirmBtnOk" class="btn btn-danger btn-sm" style="min-width: 90px;">Aceptar</button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    overlay.style.display = 'flex';

    const btnCancel = overlay.querySelector('#confirmBtnCancel');
    const btnOk = overlay.querySelector('#confirmBtnOk');

    btnCancel.onclick = () => {
      this.closeConfirm();
    };

    btnOk.onclick = () => {
      this.closeConfirm();
      onConfirm();
    };
  },

  closeConfirm() {
    const overlay = document.getElementById('confirmModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
  },

  close(idOrNothing = null) {
    
    if (idOrNothing === undefined || idOrNothing === null) {
      return this.closeDynamic();
    }
    
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


document.addEventListener('DOMContentLoaded', () => MODAL.init());
