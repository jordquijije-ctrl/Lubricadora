const DASHBOARD_API = 'http://localhost:3000/api';

const DASHBOARD_CTRL = {
  chartInstance: null,

  async init() {
    await Promise.allSettled([
      this.loadKPIs(),
      this.loadInventory(),
      this.loadAlerts(),
      this.loadMovementsAndChart()
    ]);
  },

  async loadKPIs() {
    try {
      const [resGen, resInv, resMov, resAlert] = await Promise.all([
        fetch(`${DASHBOARD_API}/estadisticas/generales`),
        fetch(`${DASHBOARD_API}/estadisticas/inventario`),
        fetch(`${DASHBOARD_API}/movimientos`),
        fetch(`${DASHBOARD_API}/alertas`)
      ]);
      const dataGen = await resGen.json();
      const dataInv = await resInv.json();
      const dataMov = await resMov.json();
      const dataAlert = await resAlert.json();

      const totalProd = dataGen.total_unidades_stock || 0;
      const valoracion = dataGen.valor_inventario || 0;
      const ventasTotales = dataGen.total_ventas || 0;

      // Calcular stock bajo/crítico
      let bajoCritico = 0;
      if (Array.isArray(dataInv)) {
        bajoCritico = dataInv.filter(i => {
          if (!i.estado_stock) return false;
          const est = i.estado_stock.toString().toLowerCase();
          return est.includes('bajo') || est.includes('crítico') || est.includes('critico');
        }).length;
      }

      const formatNumber = num => new Intl.NumberFormat('en-US').format(num);

      document.getElementById('dash-kpi-total').textContent = formatNumber(totalProd);
      document.getElementById('dash-kpi-valoracion').textContent = `$${formatNumber(valoracion)}`;
      document.getElementById('dash-kpi-bajo').textContent = bajoCritico;
      document.getElementById('dash-kpi-ventas').textContent = `$${formatNumber(ventasTotales)}`;

      // Calcular tendencias (últimos 7 días)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      let netItems = 0;
      let netSalesCount = 0;
      if (Array.isArray(dataMov)) {
        dataMov.forEach(m => {
          const mDate = new Date(m.fecha_movimiento || m.fecha);
          if (mDate >= sevenDaysAgo) {
            const tipo = (m.tipo_movimiento || m.tipo || '').toLowerCase();
            if (tipo === 'entrada' || tipo === 'compra') {
              netItems += (m.cantidad || 0);
            } else if (tipo === 'salida' || tipo === 'venta') {
              netItems -= (m.cantidad || 0);
              netSalesCount++;
            }
          }
        });
      }

      let newAlerts = 0;
      if (Array.isArray(dataAlert)) {
        dataAlert.forEach(a => {
          const aDate = new Date(a.fecha_alerta || a.fecha || a.fecha_creacion);
          if (aDate >= sevenDaysAgo) {
            newAlerts++;
          }
        });
      }

      // Renderizar tendencias
      const tTotal = document.getElementById('dash-trend-total');
      if (tTotal) {
        if (netItems > 0) { tTotal.className = 'trend up'; tTotal.textContent = `↑ +${netItems}`; }
        else if (netItems < 0) { tTotal.className = 'trend down'; tTotal.textContent = `↓ ${netItems}`; }
        else { tTotal.className = 'trend'; tTotal.textContent = '-'; }
      }

      const tVal = document.getElementById('dash-trend-valoracion');
      if (tVal) {
        tVal.className = 'trend up'; tVal.textContent = 'Actualizado';
      }

      const tBajo = document.getElementById('dash-trend-bajo');
      if (tBajo) {
        if (newAlerts > 0) { tBajo.className = 'trend down'; tBajo.textContent = `↑ ${newAlerts} nuevas`; }
        else { tBajo.className = 'trend up'; tBajo.textContent = `0 nuevas`; }
      }

      const tVentas = document.getElementById('dash-trend-ventas');
      if (tVentas) {
        tVentas.className = 'trend up'; tVentas.textContent = `↑ ${netSalesCount} (7d)`;
      }

    } catch (e) {
      console.error('Error cargando KPIs Dashboard:', e);
    }
  },

  async loadInventory() {
    try {
      const res = await fetch(`${DASHBOARD_API}/estadisticas/inventario`);
      const inventario = await res.json();
      const tbody = document.getElementById('dash-inventory-list');
      if (!tbody || !Array.isArray(inventario)) return;

      // Mostrar solo los 5-6 primeros para no alargar la tabla
      const topInv = inventario.slice(0, 6);

      tbody.innerHTML = topInv.map(p => {
        const est = (p.estado_stock || '').toString().toLowerCase();
        let badgeClass = 'ok';
        let badgeText = 'Óptimo';
        if (est.includes('bajo')) { badgeClass = 'low'; badgeText = 'Stock bajo'; }
        if (est.includes('crítico') || est.includes('critico')) { badgeClass = 'critical'; badgeText = 'Crítico'; }

        // Icono simple basado en categoría (puedes ajustar)
        let icon = '📦';
        let color = '#2F80ED'; let bg = '#E8F0FE';
        const cat = (p.categoria || '').toLowerCase();
        if (cat.includes('aceite')) { icon = '🛢️'; }
        else if (cat.includes('filtro')) { icon = '⚙️'; color = '#9B51E0'; bg = '#F3E8FD'; }
        else if (cat.includes('aditivo')) { icon = '🧴'; color = '#EB5757'; bg = '#FDE8E8'; }

        return `
          <tr>
            <td>
              <div class="product-cell">
                <div class="product-thumb" style="color: ${color}; background: ${bg};">${icon}</div>
                <div>
                  <div class="product-name">${p.nombre}</div>
                  <div class="product-sku">${p.codigo || 'SKU-?'}</div>
                </div>
              </div>
            </td>
            <td>${p.categoria || 'Sin categoría'}</td>
            <td style="font-weight: 600;">${p.stock_actual}</td>
            <td><span class="stock-badge ${badgeClass}">${badgeText}</span></td>
          </tr>
        `;
      }).join('');

      this.setupInventoryFilter();
    } catch (e) {
      console.error('Error cargando Inventario Dashboard:', e);
    }
  },

  setupInventoryFilter() {
    const inventoryCard = document.getElementById('dash-inventory-list').closest('.card');
    if (!inventoryCard) return;
    
    const inventoryTabs = inventoryCard.querySelectorAll('.dash-tab');
    const tableRows = inventoryCard.querySelectorAll('.dash-table tbody tr');

    inventoryTabs.forEach(tab => {
      // Remover event listeners antiguos clonando
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);

      newTab.addEventListener('click', (e) => {
        inventoryCard.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.textContent.trim().toLowerCase();

        tableRows.forEach(row => {
          if (filterValue === 'todos') {
            row.style.display = '';
          } else {
            const categoryCell = row.querySelectorAll('td')[1];
            if (categoryCell && categoryCell.textContent.trim().toLowerCase() === filterValue) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          }
        });
      });
    });
  },

  async loadAlerts() {
    try {
      const res = await fetch(`${DASHBOARD_API}/alertas`);
      const alertas = await res.json();
      const container = document.getElementById('dash-alert-list');
      if (!container || !Array.isArray(alertas)) return;

      const topAlerts = alertas.slice(0, 5);

      container.innerHTML = topAlerts.map(a => {
        const isResolved = a.estado === 'resuelta';
        let dotClass = 'success';
        if (!isResolved) {
          if (a.tipo === 'stock_critico') dotClass = 'critical';
          else if (a.tipo === 'stock_bajo') dotClass = 'warning';
          else dotClass = 'warning';
        }

        const dateStr = new Date(a.fecha_alerta).toLocaleDateString();

        return `
          <div class="alert-item">
            <div class="alert-dot ${dotClass}"></div>
            <div class="alert-content">
              <div class="alert-title">${a.tipo.replace('_', ' ').toUpperCase()}</div>
              <div class="alert-desc">${a.mensaje}</div>
            </div>
            <div class="alert-time">${dateStr}</div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Error cargando Alertas Dashboard:', e);
    }
  },

  async loadMovementsAndChart() {
    try {
      const res = await fetch(`${DASHBOARD_API}/movimientos`);
      const movs = await res.json();
      
      this.renderMovementsList(movs);
      this.renderChart(movs);
    } catch (e) {
      console.error('Error cargando Movimientos Dashboard:', e);
    }
  },

  renderMovementsList(movs) {
    const container = document.getElementById('dash-mov-list');
    if (!container || !Array.isArray(movs)) return;

    const topMovs = movs.slice(0, 4);

    container.innerHTML = topMovs.map(m => {
      const isEntrada = m.tipo_movimiento === 'entrada' || m.tipo_movimiento === 'compra';
      const icon = isEntrada ? '↗' : '↘';
      const colorStyle = isEntrada ? 'color: #4A7C59; background: #EDF5F0;' : 'color: #B54D4D; background: #FAEFEF;';
      const sign = isEntrada ? '+' : '-';
      const amountClass = isEntrada ? 'pos' : 'neg';
      
      const dateStr = new Date(m.fecha_movimiento).toLocaleDateString();

      return `
        <div class="mov-item">
          <div class="mov-icon" style="${colorStyle}">${icon}</div>
          <div class="mov-content">
            <div class="mov-title">${m.nombre_producto}</div>
            <div class="mov-desc">${m.tipo_movimiento} · ${dateStr}</div>
          </div>
          <div class="mov-amount ${amountClass}">${sign}${m.cantidad}</div>
        </div>
      `;
    }).join('');
  },

  renderChart(movs) {
    const ctx = document.getElementById('ventasChart');
    if (!ctx) return;

    // Procesamiento básico: agrupar por los últimos 7 días
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateObj: d,
        dateStr: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        ventas: 0,
        compras: 0
      };
    });

    if (Array.isArray(movs)) {
      movs.forEach(m => {
        const mDate = new Date(m.fecha_movimiento).toISOString().split('T')[0];
        const dayMatch = last7Days.find(d => d.dateStr === mDate);
        if (dayMatch) {
          if (m.tipo_movimiento === 'salida' || m.tipo_movimiento === 'venta') {
            dayMatch.ventas += m.cantidad;
          } else if (m.tipo_movimiento === 'entrada' || m.tipo_movimiento === 'compra') {
            dayMatch.compras += m.cantidad;
          }
        }
      });
    }

    const data = {
      labels: last7Days.map(d => d.label),
      datasets: [
        {
          label: 'Ventas',
          data: last7Days.map(d => d.ventas),
          backgroundColor: '#1A1A18',
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        },
        {
          label: 'Compras',
          data: last7Days.map(d => d.compras),
          backgroundColor: '#E8E6E1',
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, color: '#6B6962', font: { size: 12, family: "'DM Sans', sans-serif" } }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 24, 0.9)',
            titleFont: { size: 13, family: "'DM Sans', sans-serif" },
            bodyFont: { size: 13, family: "'DM Sans', sans-serif" },
            padding: 10,
            cornerRadius: 8,
            displayColors: true
          }
        },
        scales: {
          x: { grid: { display: false, drawBorder: false }, ticks: { color: '#9C9890', font: { size: 11, family: "'DM Sans', sans-serif" } } },
          y: { display: false, beginAtZero: true }
        },
        interaction: { mode: 'index', intersect: false }
      }
    };

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart(ctx, config);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('view-dashboard')) {
    DASHBOARD_CTRL.init();
    
    // Integración con NAV.go para recargar si el usuario vuelve al dashboard
    const originalNavGo = NAV.go;
    NAV.go = function(viewId) {
      originalNavGo.apply(NAV, [viewId]);
      if (viewId === 'dashboard') {
        DASHBOARD_CTRL.init();
      }
    };
  }
});
