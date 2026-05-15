const FACTURAS = {
  list: [],
  detalles: [],
  API_URL: 'http://localhost:3000/api/facturas',
  currentFactura: null,

  async loadFacturas() {
    try {
      const response = await fetch(this.API_URL);
      this.list = await response.json();
      this.render();
      TOAST.show('✅ Facturas cargadas', 'success');
    } catch (error) {
      console.error('Error cargando facturas:', error);
      TOAST.show('❌ Error al cargar facturas', 'error');
    }
  },

  render() {
    const tbody = document.querySelector('#table-facturas tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    this.list.forEach(factura => {
      const fecha = new Date(factura.fecha).toLocaleString('es-ES');
      const estadoClass = factura.estado === 'Pagada' ? 'success' : 
                         factura.estado === 'Pendiente' ? 'warning' : 'danger';
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${factura.numero_factura}</strong></td>
        <td>${factura.cliente}</td>
        <td>$${parseFloat(factura.total).toFixed(2)}</td>
        <td>${fecha}</td>
        <td><span class="badge badge-${estadoClass}">● ${factura.estado}</span></td>
        <td>
          <button onclick="FACTURAS.viewFactura(${factura.id})" class="btn-icon" title="Ver">👁️</button>
          <button onclick="FACTURAS.editFactura(${factura.id})" class="btn-icon" title="Editar">✏️</button>
          <button onclick="FACTURAS.deleteFactura(${factura.id})" class="btn-icon" title="Anular">❌</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  },

  async getProximoNumero() {
    try {
      const response = await fetch(`${this.API_URL}/proximo`);
      const data = await response.json();
      return data.numero_factura;
    } catch (error) {
      console.error('Error:', error);
      return 'FAC-4801';
    }
  },

  showModal() {
    console.log('📋 Abriendo modal de facturas...');
    console.log('Productos disponibles:', PRODUCTOS.list.length);
    
    MODAL.open('Crear Nueva Factura', `
      <form id="form-factura">
        <div class="form-group">
          <label>Número de Factura:</label>
          <input type="text" id="numero_factura" readonly class="form-input" placeholder="Auto generado">
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Cliente:</label>
            <input type="text" id="cliente" required class="form-input" placeholder="Nombre del cliente">
          </div>
          <div class="form-group">
            <label>RUC Cliente:</label>
            <input type="text" id="ruc_cliente" class="form-input" placeholder="RUC (opcional)">
          </div>
        </div>

        <div class="form-group">
          <label>Seleccionar Productos:</label>
          <div id="productos-list" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
            <!-- Se llena dinámicamente -->
          </div>
        </div>

        <div class="form-group">
          <h4>Detalles de Factura:</h4>
          <table id="detalles-table" style="width: 100%; font-size: 0.9em; border-collapse: collapse;">
            <thead>
              <tr style="background: #f0f0f0; border-bottom: 2px solid #999;">
                <th style="padding: 5px; text-align: left;">Producto</th>
                <th style="padding: 5px; width: 80px;">Cantidad</th>
                <th style="padding: 5px; width: 100px;">Precio</th>
                <th style="padding: 5px; width: 100px;">Subtotal</th>
                <th style="padding: 5px; width: 50px;"></th>
              </tr>
            </thead>
            <tbody id="detalles-tbody">
            </tbody>
          </table>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Total:</label>
            <input type="number" id="total" readonly class="form-input" value="0.00" step="0.01">
          </div>
          <div class="form-group">
            <label>Estado:</label>
            <select id="estado" class="form-input">
              <option>Pagada</option>
              <option>Pendiente</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Notas:</label>
          <textarea id="notas" class="form-input" placeholder="Notas adicionales" rows="2"></textarea>
        </div>

        <div class="button-group">
          <button type="submit" class="btn-primary">💾 Guardar Factura</button>
          <button type="button" onclick="MODAL.close()" class="btn-secondary">✖️ Cancelar</button>
        </div>
      </form>
    `);

    // Esperar a que el DOM esté listo
    setTimeout(() => {
      this.cargarProductosModal();
      this.getProximoNumero().then(num => {
        const input = document.getElementById('numero_factura');
        if (input) input.value = num;
      });

      const form = document.getElementById('form-factura');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.save();
        });
      }
    }, 100);
  },

  cargarProductosModal() {
    const lista = document.getElementById('productos-list');
    lista.innerHTML = '';

    PRODUCTOS.list.forEach(producto => {
      const div = document.createElement('div');
      div.style.cssText = 'padding: 8px; border-bottom: 1px solid #eee; cursor: pointer; hover: {background: #f0f0f0;}';
      div.innerHTML = `
        <div>
          <strong>${producto.nombre}</strong> (Stock: ${producto.stock})
          <input type="checkbox" value="${producto.id}" class="producto-checkbox" style="float: right;">
        </div>
        <small>${producto.codigo} - $${parseFloat(producto.precio_venta).toFixed(2)}</small>
      `;
      div.addEventListener('click', () => {
        const checkbox = div.querySelector('.producto-checkbox');
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
          this.agregarProductoDetalle(producto);
        } else {
          this.removerProductoDetalle(producto.id);
        }
      });
      lista.appendChild(div);
    });
  },

  agregarProductoDetalle(producto) {
    if (this.detalles.find(d => d.producto_id === producto.id)) return;

    const detalle = {
      producto_id: producto.id,
      nombre: producto.nombre,
      cantidad: 1,
      precio_unitario: producto.precio_venta,
      subtotal: producto.precio_venta
    };

    this.detalles.push(detalle);
    this.renderDetalles();
    this.calcularTotal();
  },

  removerProductoDetalle(producto_id) {
    this.detalles = this.detalles.filter(d => d.producto_id !== producto_id);
    this.renderDetalles();
    this.calcularTotal();
  },

  renderDetalles() {
    const tbody = document.getElementById('detalles-tbody');
    tbody.innerHTML = '';

    this.detalles.forEach((detalle, index) => {
      const row = document.createElement('tr');
      row.style.cssText = 'border-bottom: 1px solid #ddd;';
      row.innerHTML = `
        <td style="padding: 5px;">${detalle.nombre}</td>
        <td style="padding: 5px;">
          <input type="number" value="${detalle.cantidad}" min="1" style="width: 100%; padding: 3px;" 
            onchange="FACTURAS.cambiarCantidad(${index}, this.value)">
        </td>
        <td style="padding: 5px;">$${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
        <td style="padding: 5px;">$${parseFloat(detalle.subtotal).toFixed(2)}</td>
        <td style="padding: 5px;"><button type="button" onclick="FACTURAS.removerProductoDetalle(${detalle.producto_id})" class="btn-icon">❌</button></td>
      `;
      tbody.appendChild(row);
    });
  },

  cambiarCantidad(index, cantidad) {
    cantidad = parseInt(cantidad) || 1;
    this.detalles[index].cantidad = cantidad;
    this.detalles[index].subtotal = cantidad * this.detalles[index].precio_unitario;
    this.renderDetalles();
    this.calcularTotal();
  },

  calcularTotal() {
    const total = this.detalles.reduce((sum, d) => sum + d.subtotal, 0);
    const totalInput = document.getElementById('total');
    if (totalInput) {
      totalInput.value = total.toFixed(2);
    }
  },

  async save() {
    const cliente = document.getElementById('cliente').value;
    const ruc_cliente = document.getElementById('ruc_cliente').value;
    const total = parseFloat(document.getElementById('total').value);
    const estado = document.getElementById('estado').value;
    const notas = document.getElementById('notas').value;

    if (!cliente) {
      TOAST.show('❌', 'Ingresa el nombre del cliente');
      return;
    }

    if (this.detalles.length === 0) {
      TOAST.show('❌', 'Agrega al menos un producto');
      return;
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente,
          ruc_cliente,
          total,
          estado,
          usuario: AUTH.currentUser.name,
          notas,
          detalles: this.detalles
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar factura');
      }

      MODAL.closeDynamic();
      this.detalles = [];
      this.loadFacturas();
      TOAST.show('✅', 'Factura creada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌', error.message || 'Error al crear factura');
    }
  },

  viewFactura(id) {
    const factura = this.list.find(f => f.id === id);
    if (!factura) return;

    const fecha = new Date(factura.fecha).toLocaleString('es-ES');
    MODAL.open(`Factura ${factura.numero_factura}`, `
      <div>
        <p><strong>Cliente:</strong> ${factura.cliente}</p>
        <p><strong>RUC:</strong> ${factura.ruc_cliente || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Total:</strong> $${parseFloat(factura.total).toFixed(2)}</p>
        <p><strong>Estado:</strong> ${factura.estado}</p>
        <p><strong>Usuario:</strong> ${factura.usuario}</p>
        <p><strong>Notas:</strong> ${factura.notas || 'N/A'}</p>
        <div class="button-group">
          <button onclick="MODAL.close()" class="btn-secondary">Cerrar</button>
        </div>
      </div>
    `);
  },

  editFactura(id) {
    MODAL.open('Editar Estado de Factura', `
      <form id="form-edit-factura">
        <div class="form-group">
          <label>Nuevo Estado:</label>
          <select id="nuevo_estado" class="form-input">
            <option>Pagada</option>
            <option>Pendiente</option>
          </select>
        </div>
        <div class="button-group">
          <button type="submit" class="btn-primary">💾 Actualizar</button>
          <button type="button" onclick="MODAL.close()" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    `);

    document.getElementById('form-edit-factura').addEventListener('submit', async (e) => {
      e.preventDefault();
      const estado = document.getElementById('nuevo_estado').value;

      try {
        const response = await fetch(`${this.API_URL}/${id}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado })
        });

        if (!response.ok) throw new Error('Error al actualizar');

        MODAL.close();
        this.loadFacturas();
        TOAST.show('✅ Estado actualizado', 'success');
      } catch (error) {
        TOAST.show('❌ Error al actualizar', 'error');
      }
    });
  },

  async deleteFactura(id) {
    if (!confirm('¿Anular esta factura? Se revertirán todos los cambios de stock.')) return;

    try {
      const response = await fetch(`${this.API_URL}/${id}/anular`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Error al anular');

      this.loadFacturas();
      TOAST.show('✅ Factura anulada', 'success');
    } catch (error) {
      console.error('Error:', error);
      TOAST.show('❌ Error al anular factura', 'error');
    }
  }
};

// Cargar facturas al iniciar
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#table-facturas')) {
    FACTURAS.loadFacturas();
  }
});
