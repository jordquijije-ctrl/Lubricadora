// SCRIPT DE PRUEBA DE INTEGRACIÓN Y DIAGNÓSTICO
const http = require('http');

// El puerto del servidor activo que vamos a probar
const activePort = process.env.PORT || 3000;

// Helper para hacer peticiones HTTP locales y parsear JSON
function getJson(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ ok: true, status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ ok: true, status: res.statusCode, body: data });
          }
        } else {
          resolve({ ok: false, status: res.statusCode, body: data });
        }
      });
    }).on('error', err => resolve({ ok: false, status: 0, error: err.message }));
  });
}

async function runTests() {
  console.log('\n==================================================');
  console.log('🧪 INICIANDO PRUEBAS DE DIAGNÓSTICO EN SERVIDOR ACTIVO');
  console.log(`📡 Apuntando a: http://localhost:${activePort}`);
  console.log('==================================================\n');

  const endpoints = [
    { name: 'Health Check (Estado)', url: '/health' },
    { name: 'Catálogo de Productos', url: '/api/productos' },
    { name: 'Directorio de Proveedores', url: '/api/proveedores' },
    { name: 'Historial de Movimientos', url: '/api/movimientos' },
    { name: 'Listado de Facturas', url: '/api/facturas' },
    { name: 'Alertas de Stock', url: '/api/alertas' },
    { name: 'Estadísticas Generales', url: '/api/estadisticas/generales' },
    { name: 'Estadísticas Top Ventas', url: '/api/estadisticas/top-productos' },
    { name: 'Estadísticas Stock Crítico', url: '/api/estadisticas/inventario' }
  ];

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    console.log(`[Test] Consultando: ${ep.url}...`);
    const result = await getJson(`http://localhost:${activePort}${ep.url}`);

    if (result.ok) {
      let countInfo = '';
      if (Array.isArray(result.body)) {
        countInfo = `(${result.body.length} elementos obtenidos)`;
      } else if (result.body && typeof result.body === 'object') {
        countInfo = `(${Object.keys(result.body).length} campos devueltos)`;
      }
      console.log(`✅ OK - ${ep.name} respondió con código ${result.status} ${countInfo}`);
      passed++;
    } else {
      console.log(`❌ FALLÓ - ${ep.name} devolvió código ${result.status || 'ERROR'} - Detalle: ${result.error || result.body}`);
      failed++;
    }
  }

  console.log('\n==================================================');
  console.log('📊 RESUMEN DE DIAGNÓSTICO');
  console.log('==================================================');
  console.log(`Pruebas Totales: ${endpoints.length}`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log('==================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Error fatal durante la prueba:', err);
  process.exit(1);
});
