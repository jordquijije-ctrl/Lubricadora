# 🛢️ Lubricadoras Diana - Sistema de Control de Inventario

## 📋 Descripción General

Sistema web completo para gestionar inventario de productos lubricantes. Incluye:
- ✅ Autenticación por roles (Admin/Empleado)
- ✅ CRUD completo de productos
- ✅ Gestión de stock en tiempo real
- ✅ Alertas de stock bajo
- ✅ Base de datos SQL Server
- ✅ API REST con Node.js/Express
- ✅ Interfaz moderna y responsiva

---

## 📁 Estructura del Proyecto

```
lubricadora/
├── 📄 index.html                # HTML principal
├── 🎨 css-*.css                # Archivos CSS modulares
│   ├── css-base.css             # Variables y estilos base
│   ├── css-login.css            # Estilos de login
│   ├── css-sidebar.css          # Estilos del menú lateral
│   └── css-main.css             # Estilos principales
├── 🔧 js-*.js                  # Módulos JavaScript
│   ├── js-auth.js               # Autenticación
│   ├── js-nav.js                # Navegación
│   ├── js-ui.js                 # Modales y toasts
│   └── js-productos.js          # CRUD de productos
├── 🖥️ server.js                 # Servidor Express
├── 💾 db.js                     # Conexión SQL Server
├── 📊 models-Producto.js        # Modelo de datos
├── 🎯 controller-Producto.js    # Lógica de negocio
├── 🛣️ routes-productos.js       # Rutas API
├── 📦 package.json              # Dependencias Node
├── 🔐 .env                      # Variables de entorno
└── 📋 setup-database.sql        # Script SQL

```

---

## ✨ Características Principales

### 1️⃣ Autenticación
- Login con rol (Admin/Empleado)
- Credenciales demo incluidas
- Restricciones por rol automáticas

### 2️⃣ Gestión de Productos
- **Crear**: Agregar nuevos productos
- **Leer**: Listado con búsqueda
- **Actualizar**: Editar productos existentes
- **Eliminar**: Remover productos
- **Stock**: Actualizar stock en tiempo real

### 3️⃣ Alertas
- Stock bajo (rojo)
- Stock crítico (naranja)
- Stock óptimo (verde)

### 4️⃣ Dashboard (En desarrollo)
- Estadísticas generales
- Gráficos de ventas
- Movimientos recientes

---

## 🚀 Guía de Instalación

### Requisitos
- Node.js 14+
- SQL Server 2016+
- npm o yarn

### Pasos

#### 1. Clonar/Descargar el proyecto
```bash
cd lubricadora
```

#### 2. Instalar dependencias backend
```bash
npm install
```

#### 3. Configurar base de datos

**Opción A: Usando SQL Server Management Studio**
1. Abre `setup-database.sql` en SQL Server Management Studio
2. Ejecuta el script completo
3. Verifica la creación de tablas

**Opción B: Línea de comando**
```bash
sqlcmd -S localhost -U sa -P Admin123@ -i setup-database.sql
```

#### 4. Configurar variables de entorno
Edita `.env`:
```
DB_SERVER=localhost
DB_NAME=LubricadorasDiana
DB_USER=sa
DB_PASSWORD=Tu_Password_Aqui
PORT=3000
```

#### 5. Iniciar servidor
```bash
npm start
# O para desarrollo con auto-reload
npm run dev
```

#### 6. Abrir en navegador
```
http://localhost:3000
```

---

## 👤 Credenciales de Prueba

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Admin | `admin` | `admin123` |
| Empleado | `empleado` | `emp123` |

---

## 🔌 API Endpoints

### Productos
```
GET    /api/productos              # Obtener todos
GET    /api/productos/:id          # Obtener uno
POST   /api/productos              # Crear
PUT    /api/productos/:id          # Actualizar
DELETE /api/productos/:id          # Eliminar
PATCH  /api/productos/:id/stock    # Actualizar stock
GET    /api/productos/alertas/bajo-stock  # Bajo stock
```

### Ejemplos cURL

**Obtener todos los productos:**
```bash
curl http://localhost:3000/api/productos
```

**Crear producto:**
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Aceite Nuevo",
    "codigo": "SKU-999",
    "categoria": "Aceites",
    "precio_compra": 8.50,
    "precio_venta": 12.99,
    "stock": 50,
    "stock_minimo": 10,
    "proveedor": "Proveedor XYZ"
  }'
```

**Actualizar stock:**
```bash
curl -X PATCH http://localhost:3000/api/productos/1/stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 5}'
```

---

## 🎨 Estructura CSS

### Archivos modulares:
- **css-base.css**: Variables, reset, tipografía
- **css-login.css**: Estilos específicos de login
- **css-sidebar.css**: Menú lateral y navegación
- **css-main.css**: Layout principal, cards, tablas, modales

**Ventajas de esta estructura:**
- ✅ Fácil mantenimiento
- ✅ Reutilizable
- ✅ Permite trabajo en paralelo
- ✅ Carga optimizada

---

## 🔧 Estructura JavaScript

### Módulos:
- **js-auth.js**: Sistema de autenticación
- **js-nav.js**: Navegación entre vistas
- **js-ui.js**: Modales y notificaciones
- **js-productos.js**: CRUD de productos + API calls

### Uso en HTML:
```html
<!-- Cargar módulos en orden -->
<script src="js-auth.js"></script>
<script src="js-nav.js"></script>
<script src="js-ui.js"></script>
<script src="js-productos.js"></script>
```

### Objetos globales:
- `AUTH`: Manejo de autenticación
- `NAV`: Navegación entre vistas
- `MODAL`: Abrir/cerrar modales
- `TOAST`: Notificaciones
- `PRODUCTOS`: CRUD de productos

---

## 💾 Base de Datos

### Tablas principales:

**Productos**
```sql
- id (PK)
- nombre
- codigo (UNIQUE)
- categoria
- precio_compra
- precio_venta
- stock
- stock_minimo
- proveedor
- fecha_creacion
- fecha_actualizacion
```

**Movimientos**
```sql
- id (PK)
- producto_id (FK)
- tipo (entrada/salida)
- cantidad
- referencia
- usuario
- fecha
```

**Usuarios**
```sql
- id (PK)
- usuario (UNIQUE)
- nombre
- rol (admin/empleado)
- activo
- fecha_creacion
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- ✅ Verifica que SQL Server está corriendo
- ✅ Comprueba credenciales en `.env`
- ✅ Verifica el nombre del servidor

### Error: "API not responding"
- ✅ Verifica que `npm start` está ejecutándose
- ✅ Comprueba que el puerto 3000 no está en uso
- ✅ Abre http://localhost:3000/health

### Productos no se cargan
- ✅ Abre DevTools (F12) y ve la consola
- ✅ Ejecuta el script SQL de setup
- ✅ Verifica que la BD tiene datos

---

## 📝 Tareas Pendientes

- [ ] Módulo de facturación
- [ ] Movimientos de inventario
- [ ] Gestión de proveedores
- [ ] Reportes NIC 2
- [ ] Estadísticas y gráficos
- [ ] Autenticación JWT
- [ ] Validaciones avanzadas
- [ ] Tests unitarios

---

## 🤝 Contribuciones

Para agregar nuevas características:

1. **Crear archivo CSS**: `css-nueva-funcionalidad.css`
2. **Crear archivo JS**: `js-nueva-funcionalidad.js`
3. **Crear modelo**: `models-NuevaTabla.js`
4. **Crear controlador**: `controller-NuevaTabla.js`
5. **Crear rutas**: `routes-tabla.js`
6. **Actualizar index.html**: Agregar scripts e IDs

---

## 📞 Soporte

Para reportar bugs o solicitar features, contacta al desarrollador.

---

## 📄 Licencia

Proyecto educativo - Universidad de Guayaquil

---

**Última actualización**: 2026
**Versión**: 1.0.0
