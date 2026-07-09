const PROVEEDORES = {
  list: [],
  API_URL: '/api/proveedores',

  async loadProveedores() {
    try {
      const response = await fetch(this.API_URL);
      this.list = await response.json();
      this.render();
      TOAST.show('✅', 'Proveedores cargados');
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      TOAST.show('❌', 'Error al cargar proveedores');
    }
  },

  render() {
    const container = document.querySelector('#proveedores-container');
    if (!container) return;

    container.innerHTML = '';
    this.list.forEach(proveedor => {
      const card = document.createElement('div');
      card.className = 'proveedor-card';
      card.style.cssText = `
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s;
        cursor: pointer;
      `;

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 5px 0; color: #333;">${proveedor.nombre}</h3>
            <p style="margin: 0; color: #666; font-size: 0.9em;">
              <strong>RUC:</strong> ${proveedor.ruc}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
              <strong>Categoría:</strong> ${proveedor.categoria || 'N/A'}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
              <strong>Ciudad:</strong> ${proveedor.ciudad || 'N/A'}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
              <strong>Contacto:</strong> ${proveedor.contacto || 'N/A'}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
              <strong>Teléfono:</strong> ${proveedor.telefono || 'N/A'}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
              <strong>Email:</strong> ${proveedor.email || 'N/A'}
            </p>
          </div>
          <div style="display: flex; gap: 5px; flex-direction: column;">
            <button onclick="PROVEEDORES.editProveedor(${proveedor.id})" class="btn-icon" title="Editar">✏️</button>
            <button onclick="PROVEEDORES.deleteProveedor(${proveedor.id})" class="btn-icon" title="Eliminar">❌</button>
          </div>
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      });

      container.appendChild(card);
    });
  },

  showModal() {
    console.log('➕ Abriendo modal de nuevo proveedor...');
    MODAL.open('Crear Nuevo Proveedor', `
      <form id="form-proveedor">
        <div class="form-group">
          <label>Nombre del Proveedor:</label>
          <input type="text" id="prov_nombre" required class="form-input" placeholder="Ej: Castrol Ecuador">
        </div>

        <div class="form-group">
          <label>RUC:</label>
          <input type="text" id="prov_ruc" required class="form-input" placeholder="Ej: 0991234567001">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Categoría:</label>
            <input type="text" id="prov_categoria" class="form-input" placeholder="Ej: Aceites">
          </div>
          <div class="form-group">
            <label>Ciudad:</label>
            <input type="text" id="prov_ciudad" class="form-input" placeholder="Ej: Quito">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Teléfono:</label>
            <input type="tel" id="prov_telefono" class="form-input" placeholder="+593-2-2234567">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="prov_email" class="form-input" placeholder="contacto@proveedor.ec">
          </div>
        </div>

        <div class="form-group">
          <label>Contacto (Persona):</label>
          <input type="text" id="prov_contacto" class="form-input" placeholder="Nombre del contacto">
        </div>

        <div class="button-group">
          <button type="submit" class="btn btn-primary">💾 Guardar Proveedor</button>
          <button type="button" onclick="MODAL.close()" class="btn btn-secondary">✖️ Cancelar</button>
        </div>
      </form>
    `);

    setTimeout(() => {
      const form = document.getElementById('form-proveedor');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.save();
        });
      }
    }, 100);
  },

  async save() {
    const nombre = document.getElementById('prov_nombre').value;
    const ruc = document.getElementById('prov_ruc').value;
    const categoria = document.getElementById('prov_categoria').value;
    const ciudad = document.getElementById('prov_ciudad').value;
    const telefono = document.getElementById('prov_telefono').value;
    const email = document.getElementById('prov_email').value;
    const contacto = document.getElementById('prov_contacto').value;

    const submitBtn = document.querySelector('#form-proveedor button[type="submit"]');

    if (!nombre || !ruc) {
      TOAST.show('❌', 'Nombre y RUC son requeridos');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Guardando...';
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          ruc,
          categoria,
          ciudad,
          telefono,
          email,
          contacto
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.error || 'Error al guardar proveedor';
        
        if (errorMessage.includes('UNIQUE KEY constraint') || errorMessage.includes('duplicate key')) {
          errorMessage = 'El RUC ingresado ya existe en el sistema';
        }
        throw new Error(errorMessage);
      }

      MODAL.close();
      this.loadProveedores();
      TOAST.show('✅', 'Proveedor creado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌', error.message || 'Error al crear proveedor');
      const submitBtn = document.querySelector('#form-proveedor button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '💾 Guardar Proveedor';
      }
    }
  },

  editProveedor(id) {
    const proveedor = this.list.find(p => p.id === id);
    if (!proveedor) return;

    MODAL.open('Editar Proveedor', `
      <form id="form-edit-proveedor">
        <div class="form-group">
          <label>Nombre del Proveedor:</label>
          <input type="text" id="edit_prov_nombre" required class="form-input" value="${proveedor.nombre}">
        </div>

        <div class="form-group">
          <label>RUC:</label>
          <input type="text" id="edit_prov_ruc" required class="form-input" value="${proveedor.ruc}">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Categoría:</label>
            <input type="text" id="edit_prov_categoria" class="form-input" value="${proveedor.categoria || ''}">
          </div>
          <div class="form-group">
            <label>Ciudad:</label>
            <input type="text" id="edit_prov_ciudad" class="form-input" value="${proveedor.ciudad || ''}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Teléfono:</label>
            <input type="tel" id="edit_prov_telefono" class="form-input" value="${proveedor.telefono || ''}">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="edit_prov_email" class="form-input" value="${proveedor.email || ''}">
          </div>
        </div>

        <div class="form-group">
          <label>Contacto (Persona):</label>
          <input type="text" id="edit_prov_contacto" class="form-input" value="${proveedor.contacto || ''}">
        </div>

        <div class="button-group">
          <button type="submit" class="btn btn-primary">💾 Actualizar</button>
          <button type="button" onclick="MODAL.close()" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    `);

    document.getElementById('form-edit-proveedor').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('edit_prov_nombre').value;
      const ruc = document.getElementById('edit_prov_ruc').value;
      const categoria = document.getElementById('edit_prov_categoria').value;
      const ciudad = document.getElementById('edit_prov_ciudad').value;
      const telefono = document.getElementById('edit_prov_telefono').value;
      const email = document.getElementById('edit_prov_email').value;
      const contacto = document.getElementById('edit_prov_contacto').value;

      try {
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            ruc,
            categoria,
            ciudad,
            telefono,
            email,
            contacto
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          let errorMessage = errorData.error || 'Error al actualizar';
          if (errorMessage.includes('UNIQUE KEY constraint') || errorMessage.includes('duplicate key')) {
            errorMessage = 'El RUC ingresado ya existe en el sistema';
          }
          throw new Error(errorMessage);
        }

        MODAL.close();
        this.loadProveedores();
        TOAST.show('✅', 'Proveedor actualizado');
      } catch (error) {
        TOAST.show('❌', error.message || 'Error al actualizar proveedor');
      }
    });
  },

  deleteProveedor(id) {
    MODAL.confirm('¿Eliminar este proveedor?', async () => {
      try {
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Error al eliminar');
        }

        this.loadProveedores();
        TOAST.show('✅', 'Proveedor eliminado');
      } catch (error) {
        console.error('Error:', error);
        let msg = 'Error al eliminar proveedor';
        if (error.message.includes('REFERENCE constraint') || error.message.includes('conflicted with the REFERENCE constraint') || error.message.includes('conflict')) {
          msg = 'No se puede eliminar: el proveedor tiene movimientos o compras asociadas en el inventario';
        } else if (error.message) {
          msg = error.message;
        }
        TOAST.show('❌', msg);
      }
    });
  }
};


document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#proveedores-container')) {
    PROVEEDORES.loadProveedores();
  }
});
