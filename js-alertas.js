const ALERTAS = {
  list: [],
  API_URL: 'http://localhost:3000/api/alertas',
  filtroActual: 'todas',

  async loadAlertas(filtro = 'todas') {
    try {
      this.filtroActual = filtro;
      let url = this.API_URL;
      
      if (filtro === 'critico' || filtro === 'bajo') {
        url += `/nivel?nivel=${filtro}`;
      }

      const response = await fetch(url);
      this.list = await response.json();
      this.render();
    } catch (error) {
      console.error('Error cargando alertas:', error);
      TOAST.show('❌ Error al cargar alertas', 'error');
    }
  },

  render() {
    const tbody = document.querySelector('#table-alertas tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (this.list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;">✅ No hay alertas</td></tr>';
      return;
    }

    this.list.forEach(alerta => {
      const fecha = new Date(alerta.fecha_actualizacion).toLocaleString('es-ES');
      const estadoClass = alerta.nivel_alerta === 'critico' ? 'danger' : 'warning';
      const estadoIcon = alerta.nivel_alerta === 'critico' ? '🔴' : '🟡';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${alerta.nombre}</strong></td>
        <td style="text-align:center;">${alerta.stock}</td>
        <td style="text-align:center;">${alerta.stock_minimo}</td>
        <td><span class="badge badge-${estadoClass}">● ${estadoIcon} ${alerta.nivel_alerta.toUpperCase()}</span></td>
        <td>${fecha}</td>
      `;
      tbody.appendChild(row);
    });
  }
};

// Cargar alertas al iniciar
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#table-alertas')) {
    ALERTAS.loadAlertas();
  }
});
