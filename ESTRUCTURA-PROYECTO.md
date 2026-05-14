# 📦 Estructura del Proyecto

## Organización Actual (Sin carpetas)

```
lubricadora/
├── server.js                    # Servidor principal Express
├── db.js                        # Conexión a base de datos
│
├── CONTROLADORES
├── controller-Producto.js
├── controller-Factura.js
├── controller-Movimiento.js
├── controller-Proveedor.js
│
├── MODELOS
├── models-Producto.js
├── models-Factura.js
├── models-Movimiento.js
├── models-Proveedor.js
│
├── RUTAS
├── routes-productos.js
├── routes-facturas.js
├── routes-movimientos.js
├── routes-proveedores.js
│
├── FRONTEND
├── index.html
├── styles.css
├── script.js
├── js-*.js (archivos de lógica frontend)
├── css-*.css (estilos específicos)
│
└── package.json
```

## 🔗 Flujo de Imports

```
server.js
  ├── require('./routes-productos.js')
  ├── require('./routes-facturas.js')
  ├── require('./routes-movimientos.js')
  └── require('./routes-proveedores.js')

routes-*.js
  └── require('./controller-*.js')

controller-*.js
  └── require('./models-*.js')

models-*.js
  └── require('./db.js')
```

## ✅ Imports Corregidos

Todos los imports ahora están usando rutas relativas correctas:
- Controllers → Models: `require('./models-Producto')`
- Models → DB: `require('./db')`
- Routes → Controllers: `require('./controller-Producto')`
- Server → Routes: `require('./routes-productos')`

¡Sin errores de rutas! 🎉
