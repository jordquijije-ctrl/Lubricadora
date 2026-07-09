const ESTADISTICAS = {
  API_URL: '/api/estadisticas',

  async loadEstadisticas() {
    await Promise.allSettled([
      this.loadGenerales(),
      this.loadTopProductos(),
      this.loadEstadoInventario()
    ]);
  },

  async loadGenerales() {
    try {
    const response = await fetch(`${this.API_URL}/generales`);
    const data = await response.json();
    console.log("Frontend Generales Data:", data); 

    const container = document.getElementById('stats-resumen');
    if (!container || !data) return;

    
    const stats = {
      total_productos: data.total_productos || 0,
      cantidad_total: data.total_unidades_stock || 0,
      valor_inventario: data.valor_inventario || 0,
      total_ventas: data.total_ventas || 0
    };

      container.innerHTML = `
        <div class="stat-card">
          <div class="stat-label">Variedad Productos</div>
          <div class="stat-value">${stats.total_productos}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Stock Físico Total</div>
          <div class="stat-value">${stats.cantidad_total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Valor Inventario</div>
          <div class="stat-value">$${Number(stats.valor_inventario).toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Ventas Totales</div>
          <div class="stat-value">$${Number(stats.total_ventas).toFixed(2)}</div>
        </div>
      `;
    } catch (e) { console.error(e); }
  },

  async loadTopProductos() {
  try {
    const response = await fetch(`${this.API_URL}/top-productos`);
    const productos = await response.json();
    console.log("Frontend Top Productos:", productos); 

    const tbody = document.querySelector('#table-top-productos tbody');
    if (!tbody || !Array.isArray(productos)) return;

    tbody.innerHTML = productos.map(p => `
      <tr>
        <td>${p.nombre || 'Desconocido'}</td>
        <td style="text-align:center;">${p.unidades_vendidas || 0}</td>
        <td style="text-align:right;">$${Number(p.ingresos_generados || 0).toFixed(2)}</td>
      </tr>
    `).join('') || '<tr><td colspan="3">Sin datos</td></tr>';
  } catch (e) { console.error(e); }
},

  async loadEstadoInventario() {
    try {
      const response = await fetch(`${this.API_URL}/inventario`);
      const inventario = await response.json();
      console.log("Frontend Inventario Raw:", inventario);

      const container = document.getElementById('estado-inventario');
      if (!container || !Array.isArray(inventario)) return;

      const getCount = (tipo) => inventario.filter(i => {
        if (!i.estado_stock) return false;
        return i.estado_stock.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === tipo;
      }).length;

      
      const counts = { 
        normal: getCount('normal'), 
        bajo: getCount('bajo'), 
        critico: getCount('critico') 
      };
      const total = inventario.length || 1; 
      

      container.innerHTML = `
        <div class="progress-container">
          <div class="progress-header">
            <span class="status-name normal">Normal</span>
            <strong>${counts.normal}</strong>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill normal" style="width: ${(counts.normal / total) * 100}%"></div>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-header">
            <span class="status-name bajo">Bajo</span>
            <strong>${counts.bajo}</strong>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill bajo" style="width: ${(counts.bajo / total) * 100}%"></div>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-header">
            <span class="status-name critico">Crítico</span>
            <strong>${counts.critico}</strong>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill critico" style="width: ${(counts.critico / total) * 100}%"></div>
          </div>
        </div>
      `;
    } catch (e) { console.error("Error crítico en Inventario:", e); }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#stats-resumen')) ESTADISTICAS.loadEstadisticas();
});