const PROVEEDORES = {
  list: [],
  API_URL: 'http://localhost:3000/api/proveedores',

  async loadProveedores() {
    try {
      const response = await fetch(this.API_URL);
      this.list = await response.json();
      this.render();
      TOAST.show('✅ Proveedores cargados', 'success');
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      TOAST.show('❌ Error al cargar proveedores', 'error');
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
          <input type="text" id="nombre" required class="form-input" placeholder="Ej: Castrol Ecuador">
        </div>

        <div class="form-group">
          <label>RUC:</label>
          <input type="text" id="ruc" required class="form-input" placeholder="Ej: 0991234567001">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Categoría:</label>
            <input type="text" id="categoria" class="form-input" placeholder="Ej: Aceites">
          </div>
          <div class="form-group">
            <label>Ciudad:</label>
            <input type="text" id="ciudad" class="form-input" placeholder="Ej: Quito">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Teléfono:</label>
            <input type="tel" id="telefono" class="form-input" placeholder="+593-2-2234567">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="email" class="form-input" placeholder="contacto@proveedor.ec">
          </div>
        </div>

        <div class="form-group">
          <label>Contacto (Persona):</label>
          <input type="text" id="contacto" class="form-input" placeholder="Nombre del contacto">
        </div>

        <div class="button-group">
          <button type="submit" class="btn-primary">💾 Guardar Proveedor</button>
          <button type="button" onclick="MODAL.close()" class="btn-secondary">✖️ Cancelar</button>
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
    const nombre = document.getElementById('nombre').value;
    const ruc = document.getElementById('ruc').value;
    const categoria = document.getElementById('categoria').value;
    const ciudad = document.getElementById('ciudad').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const contacto = document.getElementById('contacto').value;

    if (!nombre || !ruc) {
      TOAST.show('❌ Nombre y RUC son requeridos', 'error');
      return;
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

      if (!response.ok) throw new Error('Error al guardar proveedor');

      MODAL.close();
      this.loadProveedores();
      TOAST.show('✅ Proveedor creado exitosamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌ Error al crear proveedor', 'error');
    }
  },

  editProveedor(id) {
    const proveedor = this.list.find(p => p.id === id);
    if (!proveedor) return;

    MODAL.open('Editar Proveedor', `
      <form id="form-edit-proveedor">
        <div class="form-group">
          <label>Nombre del Proveedor:</label>
          <input type="text" id="nombre" required class="form-input" value="${proveedor.nombre}">
        </div>

        <div class="form-group">
          <label>RUC:</label>
          <input type="text" id="ruc" required class="form-input" value="${proveedor.ruc}">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Categoría:</label>
            <input type="text" id="categoria" class="form-input" value="${proveedor.categoria || ''}">
          </div>
          <div class="form-group">
            <label>Ciudad:</label>
            <input type="text" id="ciudad" class="form-input" value="${proveedor.ciudad || ''}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Teléfono:</label>
            <input type="tel" id="telefono" class="form-input" value="${proveedor.telefono || ''}">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="email" class="form-input" value="${proveedor.email || ''}">
          </div>
        </div>

        <div class="form-group">
          <label>Contacto (Persona):</label>
          <input type="text" id="contacto" class="form-input" value="${proveedor.contacto || ''}">
        </div>

        <div class="button-group">
          <button type="submit" class="btn-primary">💾 Actualizar</button>
          <button type="button" onclick="MODAL.close()" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    `);

    document.getElementById('form-edit-proveedor').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre').value;
      const ruc = document.getElementById('ruc').value;
      const categoria = document.getElementById('categoria').value;
      const ciudad = document.getElementById('ciudad').value;
      const telefono = document.getElementById('telefono').value;
      const email = document.getElementById('email').value;
      const contacto = document.getElementById('contacto').value;

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

        if (!response.ok) throw new Error('Error al actualizar');

        MODAL.close();
        this.loadProveedores();
        TOAST.show('✅ Proveedor actualizado', 'success');
      } catch (error) {
        TOAST.show('❌ Error al actualizar proveedor', 'error');
      }
    });
  },

  async deleteProveedor(id) {
    if (!confirm('¿Eliminar este proveedor?')) return;

    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar');

      this.loadProveedores();
      TOAST.show('✅ Proveedor eliminado', 'success');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌ Error al eliminar proveedor', 'error');
    }
  }
};

// Cargar proveedores al iniciar
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#proveedores-container')) {
    PROVEEDORES.loadProveedores();
  }
});
