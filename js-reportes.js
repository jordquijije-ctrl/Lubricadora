const REPORTES = {
  API_URL: 'http://localhost:3000/api/reportes',

  async getBalance() {
    try {
      const response = await fetch(`${this.API_URL}/balance`);
      const balance = await response.json();

      const table = document.getElementById('table-balance');
      const tbody = table.querySelector('tbody');
      const loading = document.getElementById('balance-loading');

      if (balance.length === 0) {
        loading.innerHTML = '<p>No hay datos para mostrar</p>';
        return;
      }

      tbody.innerHTML = '';
      let totalValor = 0;

      balance.forEach(item => {
        const row = document.createElement('tr');
        row.style.cssText = 'border-bottom: 1px solid #ddd;';
        const valor = item.valor_costo || 0;
        totalValor += parseFloat(valor);
        row.innerHTML = `
          <td style="padding: 8px;">${item.nombre}</td>
          <td style="padding: 8px; text-align: center;">${item.cantidad_final}</td>
          <td style="padding: 8px; text-align: right;">$${parseFloat(valor).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });

      // Agregar total
      const totalRow = document.createElement('tr');
      totalRow.style.cssText = 'border-top: 2px solid #999; font-weight: bold; background: #f0f0f0;';
      totalRow.innerHTML = `
        <td style="padding: 8px;">TOTAL</td>
        <td style="padding: 8px; text-align: center;"></td>
        <td style="padding: 8px; text-align: right;">$${totalValor.toFixed(2)}</td>
      `;
      tbody.appendChild(totalRow);

      table.style.display = 'table';
      loading.style.display = 'none';
    } catch (error) {
      console.error('Error cargando balance:', error);
      TOAST.show('❌ Error al generar reporte', 'error');
    }
  },

  async getCostoVentas() {
    try {
      const response = await fetch(`${this.API_URL}/costo-ventas`);
      const costos = await response.json();

      const container = document.getElementById('costo-ventas-resumen');
      const loading = document.getElementById('costo-loading');

      if (costos.length === 0) {
        container.innerHTML = '<p>No hay datos para mostrar</p>';
        container.style.display = 'block';
        loading.style.display = 'none';
        return;
      }

      let totalCosto = 0;
      let totalIngresos = 0;
      let totalGanancia = 0;

      costos.forEach(item => {
        totalCosto += parseFloat(item.costo_venta || 0);
        totalIngresos += parseFloat(item.ingresos || 0);
        totalGanancia += parseFloat(item.ganancia || 0);
      });

      const margen = totalIngresos > 0 ? ((totalGanancia / totalIngresos) * 100).toFixed(2) : 0;

      container.innerHTML = `
        <div style="margin-bottom: 10px;">
          <strong>Total Costo de Ventas:</strong> $${totalCosto.toFixed(2)}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Total Ingresos:</strong> $${totalIngresos.toFixed(2)}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Total Ganancia:</strong> <span style="color: #43e97b;">$${totalGanancia.toFixed(2)}</span>
        </div>
        <div style="padding: 10px; background: #e8f5e9; border-radius: 3px;">
          <strong>Margen de Ganancia:</strong> <span style="color: #2e7d32;">${margen}%</span>
        </div>
      `;

      container.style.display = 'block';
      loading.style.display = 'none';
    } catch (error) {
      console.error('Error cargando costo de ventas:', error);
      TOAST.show('❌ Error al generar reporte', 'error');
    }
  }
};

// Cargar reportes al iniciar (con datos vacíos hasta que se haga clic)
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#table-balance')) {
    // Los reportes se cargan bajo demanda
  }
});
