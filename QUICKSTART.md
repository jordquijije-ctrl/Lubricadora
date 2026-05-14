# 🚀 INICIO RÁPIDO - Lubricadoras Diana

## ⚡ 5 Minutos para empezar

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Configurar SQL Server

**Opción A: Automática (En el mismo SQL Server)**
```bash
# Ejecuta el script SQL (en Management Studio o Azure Data Studio):
# Abre: setup-database.sql
# Click en "Ejecutar" o F5
```

**Opción B: Línea de comando**
```bash
sqlcmd -S localhost -U sa -P Admin123@ -i setup-database.sql
```

### 3️⃣ Actualizar .env (si es necesario)
```
DB_SERVER=localhost
DB_NAME=LubricadorasDiana
DB_USER=sa
DB_PASSWORD=Admin123@
PORT=3000
```

### 4️⃣ Iniciar servidor
```bash
npm start
```

Verás:
```
✅ Conectado a SQL Server
🚀 Servidor corriendo en http://localhost:3000
```

### 5️⃣ Abrir en navegador
```
http://localhost:3000
```

### 6️⃣ Login
- **Admin**: admin / admin123
- **Empleado**: empleado / emp123

---

## 📊 Rutas de archivos principales

### 🎨 CSS (Modulares)
- `css-base.css` → Variables y estilos globales
- `css-login.css` → Pantalla de login
- `css-sidebar.css` → Menú lateral
- `css-main.css` → Layout principal

### 🔧 JavaScript (Modulares)
- `js-auth.js` → Login y autenticación
- `js-nav.js` → Navegación entre vistas
- `js-ui.js` → Modales y notificaciones
- `js-productos.js` → Gestión de productos (CRUD)

### 🖥️ Backend (Node.js)
- `server.js` → Servidor Express
- `db.js` → Conexión SQL Server
- `models-Producto.js` → Lógica de datos
- `controller-Producto.js` → Controladores
- `routes-productos.js` → Endpoints API

### 💾 Base de datos
- `setup-database.sql` → Script para crear tablas

---

## ✅ Funcionalidades actuales

### ✔️ Ya implementadas:
1. **Login**: Con roles (Admin/Empleado)
2. **Dashboard**: Página principal
3. **Productos**: 
   - Ver listado
   - Crear ✅
   - Editar ✅
   - Eliminar ✅
   - Stock en tiempo real ✅
4. **Navegación**: Entre todas las vistas
5. **Alertas**: Stock bajo (visual)
6. **Notificaciones**: Toast notifications
7. **API REST**: Todos los endpoints

### ⏳ En desarrollo:
- Facturación
- Movimientos
- Estadísticas
- Reportes

---

## 🔌 Endpoints API (Listos para usar)

```bash
# Obtener todos los productos
GET http://localhost:3000/api/productos

# Crear producto
POST http://localhost:3000/api/productos
{
  "nombre": "Aceite XYZ",
  "codigo": "SKU-999",
  "categoria": "Aceites",
  "precio_compra": 10,
  "precio_venta": 15,
  "stock": 50,
  "stock_minimo": 10,
  "proveedor": "Proveedor"
}

# Actualizar producto
PUT http://localhost:3000/api/productos/1
{ "nombre": "Nuevo nombre", ... }

# Eliminar producto
DELETE http://localhost:3000/api/productos/1

# Actualizar solo el stock
PATCH http://localhost:3000/api/productos/1/stock
{ "cantidad": 5 }

# Ver productos con stock bajo
GET http://localhost:3000/api/productos/alertas/bajo-stock
```

---

## 🎯 Próximos pasos (Recomendado)

### Paso 1: Verificar que funciona
1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Login con: admin / admin123
4. Ve a "Productos"
5. Deberías ver la tabla con datos

### Paso 2: Crear un producto
1. Click en "Nuevo Producto"
2. Llena los campos
3. Haz click en "Guardar"
4. Debería aparecer inmediatamente en la tabla

### Paso 3: Editar un producto
1. En la tabla, haz click en "Editar"
2. Modifica los valores
3. Haz click en "Guardar"

### Paso 4: Eliminar un producto
1. En la tabla, haz click en "Eliminar"
2. Confirma el eliminado
3. El producto desaparece de la tabla

---

## 🐛 Si algo no funciona

### La tabla de productos está vacía
```bash
# Verifica que la BD tiene datos:
sqlcmd -S localhost -U sa -P Admin123@
> USE LubricadorasDiana
> SELECT * FROM Productos
> GO
```

### El servidor no inicia
```bash
# Verifica que SQL Server está corriendo:
# En Windows: Services → SQL Server (MSSQLSERVER) → Iniciar
# O busca: "SQL Server Configuration Manager"
```

### Error "CORS"
- Verifica que el frontend abre en `http://localhost:3000`
- No en `127.0.0.1` o diferente puerto

### Error en la consola del navegador
- Abre DevTools (F12)
- Ve a Console
- Lee el error exacto
- Busca en Google el error

---

## 📚 Estructura para agregar nuevas funciones

### Ejemplo: Agregar "Movimientos"

1. **Crear modelo SQL**
   ```bash
   # En setup-database.sql, agregar tabla
   CREATE TABLE Movimientos (...)
   ```

2. **Crear modelo JavaScript**
   ```bash
   # Crear: models-Movimiento.js
   ```

3. **Crear controlador**
   ```bash
   # Crear: controller-Movimiento.js
   ```

4. **Crear rutas**
   ```bash
   # Crear: routes-movimientos.js
   ```

5. **Crear UI**
   ```bash
   # Crear: css-movimientos.css
   # Crear: js-movimientos.js
   # Agregar a index.html
   ```

6. **Conectar en servidor.js**
   ```javascript
   const movimientosRoutes = require('./routes/movimientos');
   app.use('/api/movimientos', movimientosRoutes);
   ```

---

## 📞 Comandos útiles

```bash
# Iniciar con auto-reload (dev)
npm run dev

# Iniciar modo producción
npm start

# Ver logs en tiempo real
npm start > logs.txt 2>&1

# Instalar nuevas dependencias
npm install nombre-paquete

# Limpiar node_modules (si hay problemas)
rm -r node_modules && npm install
```

---

## ✨ Características especiales

### 🔄 Actualización en tiempo real
Cuando cambias un producto, la tabla se actualiza automáticamente sin recargar la página.

### 🎨 Tema personalizable
Todos los colores están en `css-base.css` como variables CSS:
```css
:root {
  --accent: #C4A35A;      /* Cambiar color principal */
  --danger: #B54D4D;      /* Cambiar color de peligro */
  /* etc... */
}
```

### 📱 Responsive
La UI se adapta automáticamente a móviles y tablets.

### ⚡ Modular
Cada funcionalidad está en su propio archivo para fácil edición.

---

¡Listo para usar! 🎉

Cualquier pregunta, revisa el archivo `README-COMPLETO.md`
