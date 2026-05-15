const MOVIMIENTOS = {
  list: [],
  API_URL: 'http://localhost:3000/api/movimientos',
  filtroActual: 'todos',

  async loadMovimientos(filtro = 'todos') {
    try {
      this.filtroActual = filtro;
      let url = this.API_URL;
      
      if (filtro === 'entradas') url += '?tipo=entrada';
      else if (filtro === 'salidas') url += '?tipo=salida';

      const response = await fetch(url);
      this.list = await response.json();
      this.render();
      TOAST.show('✅ Movimientos cargados', 'success');
    } catch (error) {
      console.error('Error cargando movimientos:', error);
      TOAST.show('❌ Error al cargar movimientos', 'error');
    }
  },

  render() {
    const tbody = document.querySelector('#table-movimientos tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    this.list.forEach(movimiento => {
      const fecha = new Date(movimiento.fecha).toLocaleString('es-ES');
      const tipoClass = movimiento.tipo === 'entrada' ? 'success' : 'danger';
      const cantidadDisplay = movimiento.tipo === 'entrada' 
        ? `<strong style="color: green;">+${movimiento.cantidad}</strong>` 
        : `<strong style="color: red;">-${movimiento.cantidad}</strong>`;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${fecha}</td>
        <td><span class="badge badge-${tipoClass}">● ${movimiento.tipo}</span></td>
        <td>${movimiento.producto}</td>
        <td>${cantidadDisplay}</td>
        <td>${movimiento.referencia || '-'}</td>
        <td>${movimiento.proveedor || '-'}</td>
        <td>${movimiento.usuario || '-'}</td>
        <td>
          <button onclick="MOVIMIENTOS.viewDetalle(${movimiento.id})" class="btn-icon" title="Ver">👁️</button>
          <button onclick="MOVIMIENTOS.deleteMovimiento(${movimiento.id})" class="btn-icon" title="Eliminar">❌</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  },

  showModalEntrada() {
    console.log('📥 Abriendo modal de entrada...');
    MODAL.open('Registrar Entrada de Inventario', `
      <form id="form-entrada">
        <div class="form-group">
          <label>Producto:</label>
          <select id="producto_id" required class="form-input">
            <option value="">-- Selecciona un producto --</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="cantidad" required min="1" class="form-input" placeholder="0">
          </div>
          <div class="form-group">
            <label>Proveedor:</label>
            <select id="proveedor_id" class="form-input">
              <option value="">-- Selecciona proveedor (opcional) --</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Referencia (Orden, Factura):</label>
          <input type="text" id="referencia" class="form-input" placeholder="Ej: Orden #1847">
        </div>

        <div class="form-group">
          <label>Descripción:</label>
          <textarea id="descripcion" class="form-input" placeholder="Detalles adicionales" rows="3"></textarea>
        </div>

        <div class="button-group">
          <button type="submit" class="btn-primary">📥 Registrar Entrada</button>
          <button type="button" onclick="MODAL.close()" class="btn-secondary">✖️ Cancelar</button>
        </div>
      </form>
    `);

    setTimeout(() => {
      this.cargarSelectsEntrada();
      const form = document.getElementById('form-entrada');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveEntrada();
        });
      }
    }, 100);
  },

  showModalSalida() {
    console.log('📤 Abriendo modal de salida...');
    MODAL.open('Registrar Salida de Inventario', `
      <form id="form-salida">
        <div class="form-group">
          <label>Producto:</label>
          <select id="producto_id" required class="form-input">
            <option value="">-- Selecciona un producto --</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="cantidad" required min="1" class="form-input" placeholder="0">
          </div>
        </div>

        <div class="form-group">
          <label>Referencia (Factura, Venta):</label>
          <input type="text" id="referencia" class="form-input" placeholder="Ej: FAC-#4821">
        </div>

        <div class="form-group">
          <label>Descripción:</label>
          <textarea id="descripcion" class="form-input" placeholder="Motivo de salida" rows="3"></textarea>
        </div>

        <div class="button-group">
          <button type="submit" class="btn-primary">📤 Registrar Salida</button>
          <button type="button" onclick="MODAL.close()" class="btn-secondary">✖️ Cancelar</button>
        </div>
      </form>
    `);

    setTimeout(() => {
      this.cargarSelectsSalida();
      const form = document.getElementById('form-salida');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveSalida();
        });
      }
    }, 100);
  },

  cargarSelectsEntrada() {
    const selectProducto = document.getElementById('producto_id');
    const selectProveedor = document.getElementById('proveedor_id');

    // Cargar productos
    PRODUCTOS.list.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.nombre} (Stock: ${p.stock})`;
      selectProducto.appendChild(option);
    });

    // Cargar proveedores
    if (window.PROVEEDORES && PROVEEDORES.list) {
      PROVEEDORES.list.forEach(pr => {
        const option = document.createElement('option');
        option.value = pr.id;
        option.textContent = pr.nombre;
        selectProveedor.appendChild(option);
      });
    }
  },

  cargarSelectsSalida() {
    const selectProducto = document.getElementById('producto_id');

    PRODUCTOS.list.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.nombre} (Stock: ${p.stock})`;
      selectProducto.appendChild(option);
    });
  },

  async saveEntrada() {
    const producto_id = parseInt(document.getElementById('producto_id').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const referencia = document.getElementById('referencia').value;
    const proveedor_id = document.getElementById('proveedor_id').value ? parseInt(document.getElementById('proveedor_id').value) : null;
    const descripcion = document.getElementById('descripcion').value;

    if (!producto_id || !cantidad) {
      TOAST.show('❌', 'Producto y cantidad son requeridos');
      return;
    }

    try {
      const response = await fetch(`${this.API_URL}/entrada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id,
          cantidad,
          referencia,
          proveedor_id,
          usuario: AUTH.currentUser.name,
          descripcion
        })
      });

      if (!response.ok) throw new Error('Error al registrar entrada');

      MODAL.closeDynamic();
      this.loadMovimientos(this.filtroActual);
      PRODUCTOS.loadProductos();
      TOAST.show('✅', 'Entrada registrada correctamente');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌', error.message || 'Error al registrar entrada');
    }
  },

  async saveSalida() {
    const producto_id = parseInt(document.getElementById('producto_id').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const referencia = document.getElementById('referencia').value;
    const descripcion = document.getElementById('descripcion').value;

    if (!producto_id || !cantidad) {
      TOAST.show('❌', 'Producto y cantidad son requeridos');
      return;
    }

    try {
      const response = await fetch(`${this.API_URL}/salida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id,
          cantidad,
          referencia,
          usuario: AUTH.currentUser.name,
          descripcion
        })
      });

      if (!response.ok) throw new Error('Error al registrar salida');

      MODAL.closeDynamic();
      this.loadMovimientos(this.filtroActual);
      PRODUCTOS.loadProductos();
      TOAST.show('✅', 'Salida registrada correctamente');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌', error.message || 'Error al registrar salida');
    }
  },

  viewDetalle(id) {
    const movimiento = this.list.find(m => m.id === id);
    if (!movimiento) return;

    const fecha = new Date(movimiento.fecha).toLocaleString('es-ES');
    MODAL.open(`Detalle de Movimiento`, `
      <div>
        <p><strong>Tipo:</strong> ${movimiento.tipo.toUpperCase()}</p>
        <p><strong>Producto:</strong> ${movimiento.producto}</p>
        <p><strong>Cantidad:</strong> ${movimiento.tipo === 'entrada' ? '+' : '-'}${movimiento.cantidad}</p>
        <p><strong>Referencia:</strong> ${movimiento.referencia || 'N/A'}</p>
        <p><strong>Proveedor:</strong> ${movimiento.proveedor || 'N/A'}</p>
        <p><strong>Usuario:</strong> ${movimiento.usuario}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Descripción:</strong> ${movimiento.descripcion || 'N/A'}</p>
        <div class="button-group">
          <button onclick="MODAL.close()" class="btn-secondary">Cerrar</button>
        </div>
      </div>
    `);
  },

  async deleteMovimiento(id) {
    if (!confirm('¿Eliminar este movimiento? Se revertirán los cambios de stock.')) return;

    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar');

      this.loadMovimientos(this.filtroActual);
      PRODUCTOS.loadProductos();
      TOAST.show('✅ Movimiento eliminado y stock revertido', 'success');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌ Error al eliminar movimiento', 'error');
    }
  }
};

// Cargar movimientos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#table-movimientos')) {
    MOVIMIENTOS.loadMovimientos();
  }
});
