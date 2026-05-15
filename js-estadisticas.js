const ESTADISTICAS = {
  API_URL: 'http://localhost:3000/api/estadisticas',

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
    console.log("Frontend Generales Data:", data); // PRINT DE CONTROL 2

    const container = document.getElementById('stats-resumen');
    if (!container || !data) return;

    // CORRECCIÓN: Usar las llaves que vienen del Backend (JSON)
    const stats = {
      total_productos: data.total_productos || 0,
      cantidad_total: data.total_unidades_stock || 0,
      valor_inventario: data.valor_inventario || 0,
      total_ventas: data.total_ventas || 0
    };

      container.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px;">
          <div style="font-size: 0.9em; opacity: 0.9;">Variedad Productos</div>
          <div style="font-size: 2em; font-weight: bold;">${stats.total_productos}</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px;">
          <div style="font-size: 0.9em; opacity: 0.9;">Stock Físico Total</div>
          <div style="font-size: 2em; font-weight: bold;">${stats.cantidad_total}</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 8px;">
          <div style="font-size: 0.9em; opacity: 0.9;">Valor Inventario</div>
          <div style="font-size: 2em; font-weight: bold;">$${Number(stats.valor_inventario).toFixed(2)}</div>
        </div>
        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 20px; border-radius: 8px;">
          <div style="font-size: 0.9em; opacity: 0.9;">Ventas Totales</div>
          <div style="font-size: 2em; font-weight: bold;">$${Number(stats.total_ventas).toFixed(2)}</div>
        </div>
      `;
    } catch (e) { console.error(e); }
  },

  async loadTopProductos() {
  try {
    const response = await fetch(`${this.API_URL}/top-productos`);
    const productos = await response.json();
    console.log("Frontend Top Productos:", productos); // PRINT DE CONTROL 3

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

      // --- LAS LÍNEAS QUE FALTABAN ---
      const counts = { 
        normal: getCount('normal'), 
        bajo: getCount('bajo'), 
        critico: getCount('critico') 
      };
      const total = inventario.length || 1; 
      // -------------------------------

      container.innerHTML = `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;"><span>✅ Normal</span> <strong>${counts.normal}</strong></div>
          <div style="background: #eee; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background: #43e97b; height: 100%; width: ${(counts.normal / total) * 100}%"></div>
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;"><span>🟡 Bajo</span> <strong>${counts.bajo}</strong></div>
          <div style="background: #eee; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background: #ffd700; height: 100%; width: ${(counts.bajo / total) * 100}%"></div>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between;"><span>🔴 Crítico</span> <strong>${counts.critico}</strong></div>
          <div style="background: #eee; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background: #ff6b6b; height: 100%; width: ${(counts.critico / total) * 100}%"></div>
          </div>
        </div>
      `;
    } catch (e) { console.error("Error crítico en Inventario:", e); }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#stats-resumen')) ESTADISTICAS.loadEstadisticas();
});