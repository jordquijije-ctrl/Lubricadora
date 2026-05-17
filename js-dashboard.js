// js-dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('ventasChart');
  if (!ctx) return;

  const data = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Ventas',
        data: [120, 190, 300, 250, 200, 350, 150],
        backgroundColor: '#1A1A18', // var(--text-primary)
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: 'Compras',
        data: [80, 150, 200, 180, 120, 250, 100],
        backgroundColor: '#E8E6E1', // var(--border)
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
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            color: '#6B6962',
            font: {
              size: 12,
              family: "'DM Sans', sans-serif"
            }
          }
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
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#9C9890',
            font: { size: 11, family: "'DM Sans', sans-serif" }
          }
        },
        y: {
          display: false, // Ocultar eje Y para mantener el diseño limpio
          beginAtZero: true
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      }
    }
  };

  new Chart(ctx, config);

  // Filtrado de Inventario de Productos
  const inventoryCard = document.querySelector('.dash-table').closest('.card');
  if (inventoryCard) {
    const inventoryTabs = inventoryCard.querySelectorAll('.dash-tab');
    const tableRows = inventoryCard.querySelectorAll('.dash-table tbody tr');

    inventoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        inventoryTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.textContent.trim();

        tableRows.forEach(row => {
          if (filterValue === 'Todos') {
            row.style.display = '';
          } else {
            const categoryCell = row.querySelectorAll('td')[1];
            if (categoryCell && categoryCell.textContent.trim() === filterValue) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          }
        });
      });
    });
  }
});
