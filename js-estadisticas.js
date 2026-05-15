const ESTADISTICAS = {
  API_URL: 'http://localhost:3000/api/estadisticas',

  async loadEstadisticas() {
    try {
      // Cargar estadísticas generales
      await this.loadGenerales();
      // Cargar top productos
      await this.loadTopProductos();
      // Cargar estado inventario
      await this.loadEstadoInventario();
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  },

  async loadGenerales() {
    try {
      const response = await fetch(`${this.API_URL}/generales`);
      const data = await response.json();

      const container = document.getElementById('stats-resumen');
      if (!container) return;

      container.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9em; opacity: 0.9;">Total Productos</div>
          <div style="font-size: 2em; font-weight: bold;">${data.total_productos || 0}</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9em; opacity: 0.9;">Cantidad Total</div>
          <div style="font-size: 2em; font-weight: bold;">${data.cantidad_total || 0}</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9em; opacity: 0.9;">Valor Inventario</div>
          <div style="font-size: 2em; font-weight: bold;">$${(data.valor_inventario || 0).toFixed(2)}</div>
        </div>
        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9em; opacity: 0.9;">Total Ventas</div>
          <div style="font-size: 2em; font-weight: bold;">$${(data.total_ventas || 0).toFixed(2)}</div>
        </div>
      `;
    } catch (error) {
      console.error('Error cargando generales:', error);
    }
  },

  async loadTopProductos() {
    try {
      const response = await fetch(`${this.API_URL}/top-productos?limite=10`);
      const productos = await response.json();

      const tbody = document.querySelector('#table-top-productos tbody');
      if (!tbody) return;

      tbody.innerHTML = '';
      if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:10px;">No hay datos</td></tr>';
        return;
      }

      productos.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${p.nombre}</td>
          <td style="text-align:center;">${p.cantidad_vendida || 0}</td>
          <td style="text-align:right;">$${(p.ingresos || 0).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error cargando top productos:', error);
    }
  },

  async loadEstadoInventario() {
    try {
      const response = await fetch(`${this.API_URL}/inventario`);
      const inventario = await response.json();

      const container = document.getElementById('estado-inventario');
      if (!container) return;

      const normal = inventario.filter(i => i.estado_stock === 'Normal').length;
      const bajo = inventario.filter(i => i.estado_stock === 'Bajo').length;
      const critico = inventario.filter(i => i.estado_stock === 'Crítico').length;

      container.innerHTML = `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>✅ Normal</span>
            <strong>${normal}</strong>
          </div>
          <div style="background: #eee; height: 20px; border-radius: 5px; overflow: hidden;">
            <div style="background: #43e97b; height: 100%; width: ${inventario.length > 0 ? (normal/inventario.length*100) : 0}%"></div>
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>🟡 Bajo</span>
            <strong>${bajo}</strong>
          </div>
          <div style="background: #eee; height: 20px; border-radius: 5px; overflow: hidden;">
            <div style="background: #ffd700; height: 100%; width: ${inventario.length > 0 ? (bajo/inventario.length*100) : 0}%"></div>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>🔴 Crítico</span>
            <strong>${critico}</strong>
          </div>
          <div style="background: #eee; height: 20px; border-radius: 5px; overflow: hidden;">
            <div style="background: #ff6b6b; height: 100%; width: ${inventario.length > 0 ? (critico/inventario.length*100) : 0}%"></div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error cargando estado inventario:', error);
    }
  }
};

// Cargar estadísticas al iniciar
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#stats-resumen')) {
    ESTADISTICAS.loadEstadisticas();
  }
});
