const ALERTAS = {
  list: [],
  API_URL: '/api/alertas',

  async loadAlertas() {
    try {
      const response = await fetch(this.API_URL);
      this.list = await response.json();
      this.render(this.list); 
    } catch (error) {
      console.error('Error cargando alertas:', error);
      if (typeof TOAST !== 'undefined') TOAST.show('❌ Error al cargar alertas', 'error');
    }
  },

  filterAlerts(nivel, btn) {
    const botones = document.querySelectorAll('#view-alertas .filter-btn');
    botones.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (nivel === 'todas') {
      this.render(this.list);
    } else {
      const filtrados = this.list.filter(alerta => {
        // Normalizamos "Crítico" -> "critico" para comparar con el valor del botón
        const sev = (alerta.severidad || '')
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return sev === nivel;
      });
      this.render(filtrados);
    }
  },

  render(datosAMostrar) {
    const tbody = document.querySelector('#table-alertas tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (!datosAMostrar || datosAMostrar.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;">✅ No hay alertas</td></tr>';
      return;
    }

    datosAMostrar.forEach(alerta => {
      // Ajuste de nombres según tu AlertaModel.getAll()
      const nivelTexto = alerta.severidad || 'Bajo';
      const esCritico = nivelTexto.toLowerCase().includes('crít');
      
      const estadoClass = esCritico ? 'danger' : 'warning';
      const estadoIcon = esCritico ? '🔴' : '🟡';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${alerta.nombre || 'Sin nombre'}</strong></td>
        <td style="text-align:center;">${alerta.stock_actual || 0}</td>
        <td style="text-align:center;">${alerta.stock_minimo || 0}</td>
        <td>
          <span class="badge badge-${estadoClass}" style="display: inline-flex; width: 110px; justify-content: center; font-family: monospace;"> ${estadoIcon} ${nivelTexto.toUpperCase()}</span>
        </td>
        <td>${new Date().toLocaleDateString()}</td>
      `;
      tbody.appendChild(row);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#table-alertas')) {
    ALERTAS.loadAlertas();
  }
});