# 📋 Guía de Facturas - Lubricadora Diana

## ✅ Problemas Arreglados

Se han corregido los errores en:
- ❌ **Alertas**: Error al cargar -> ✅ ARREGLADO
- ❌ **Movimientos**: Error al cargar -> ✅ ARREGLADO
- ❌ **Facturas**: Error al cargar -> ✅ ARREGLADO

El problema era en los archivos de modelos que usaban `db.sql.NVarChar` y `db.sql.Decimal` sin importar correctamente el módulo `mssql`. Se ha solucionado importando `mssql` directamente en cada modelo.

---

## 📝 Módulo de Facturas

### Funcionalidades Implementadas

1. **Ver todas las facturas**
   - Lista de facturas recientes (hoy, semana, mes)
   - Filtros por estado (Pagada, Pendiente, Anulada)
   - Búsqueda por número de factura y cliente

2. **Crear nueva factura**
   - Selecciona productos del inventario
   - Calcula automáticamente subtotales
   - Actualiza stock automáticamente
   - Genera número de factura secuencial (FAC-XXXX)

3. **Detalles de factura**
   - Ver productos incluidos
   - Ver precio unitario y total
   - Historial de cambios de estado

4. **Cambiar estado**
   - Pendiente → Pagada
   - Pagada → Pendiente
   - Cualquier estado → Anulada

5. **Anular factura**
   - Revierte el stock de todos los productos
   - Cambia estado a "Anulada"
   - Mantiene registro del movimiento

---

## 🗄️ Estructura de Base de Datos Necesaria

### Tabla: Facturas

```sql
CREATE TABLE Facturas (
    id INT PRIMARY KEY IDENTITY(1,1),
    numero_factura NVARCHAR(50) UNIQUE NOT NULL,
    cliente NVARCHAR(150) NOT NULL,
    ruc_cliente NVARCHAR(20),
    fecha DATETIME DEFAULT GETDATE(),
    total DECIMAL(12,2) DEFAULT 0,
    estado NVARCHAR(20) DEFAULT 'Pendiente', -- 'Pagada', 'Pendiente', 'Anulada'
    usuario NVARCHAR(100),
    notas NVARCHAR(MAX),
    fecha_actualizacion DATETIME DEFAULT GETDATE()
);
```

### Tabla: Factura_Detalles

```sql
CREATE TABLE Factura_Detalles (
    id INT PRIMARY KEY IDENTITY(1,1),
    factura_id INT NOT NULL FOREIGN KEY REFERENCES Facturas(id),
    producto_id INT NOT NULL FOREIGN KEY REFERENCES Productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL
);
```

### Tabla: Movimientos (Ya existe)

```sql
-- Los movimientos de facturas se registran automáticamente aquí
-- Con referencia = numero_factura y tipo = 'salida'
```

---

## 🔧 Configuración del Sistema

### 1. Variables de Entorno (.env)

```env
PORT=3000
DB_NAME=LubricadorasDiana
DB_USER=sa
DB_PASSWORD=Admin123@
```

### 2. Requisitos del Servidor

- Node.js v14+
- SQL Server 2019+
- Express.js
- mssql driver

### 3. Instalación de Dependencias

```bash
npm install
```

---

## 🚀 Cómo Usar el Módulo de Facturas

### Crear una Factura

1. Ve a **Facturación** → **+ Nueva Factura**
2. Ingresa datos del cliente
3. Selecciona productos del inventario
4. Ajusta cantidades
5. El total se calcula automáticamente
6. Haz clic en **Guardar Factura**

**Automáticamente:**
- Se genera el número de factura (FAC-XXXX)
- Se reduce el stock de cada producto
- Se registra el movimiento de salida
- Se guarda con estado "Pendiente" o "Pagada"

### Cambiar Estado de Factura

1. Ve a **Facturación** → selecciona factura
2. Haz clic en el ícono **✏️** (Editar)
3. Cambia el estado en el dropdown
4. Confirma

### Anular una Factura

1. Ve a **Facturación** → selecciona factura
2. Haz clic en el ícono **❌** (Anular)
3. Confirma la operación

**Nota:** Se revierte automáticamente el stock de todos los productos.

---

## 📊 Endpoints API Disponibles

### Obtener todas las facturas
```
GET /api/facturas
```

### Obtener factura por ID
```
GET /api/facturas/:id
```

### Obtener próximo número de factura
```
GET /api/facturas/proximo
```

### Crear nueva factura
```
POST /api/facturas
Body: {
  cliente: "string",
  ruc_cliente: "string",
  total: number,
  estado: "Pendiente" | "Pagada",
  usuario: "string",
  notas: "string",
  detalles: [
    {
      producto_id: number,
      cantidad: number,
      precio_unitario: number,
      subtotal: number
    }
  ]
}
```

### Actualizar estado
```
PUT /api/facturas/:id/estado
Body: {
  estado: "Pendiente" | "Pagada" | "Anulada"
}
```

### Anular factura
```
PUT /api/facturas/:id/anular
```

---

## 🐛 Solución de Problemas

### Error: "Cannot read properties of undefined"
- **Causa**: Problema con tipos de SQL Server
- **Solución**: ✅ YA ARREGLADO - Se agregó el import de `mssql` en los modelos

### Error: "Factura no encontrada"
- **Causa**: ID de factura inválido
- **Solución**: Verifica que el ID sea un número válido

### Error: "Stock insuficiente"
- **Causa**: No hay suficiente cantidad del producto
- **Solución**: Ajusta la cantidad o registra entrada de inventario primero

### No aparecen las alertas/movimientos
- **Causa**: Errores en la conexión a BD
- **Solución**: ✅ ARREGLADO - Revisa console del navegador F12

---

## 📌 Notas Importantes

1. **Las facturas son inmutables después de pagadas** - Considera si necesitas permitir edición
2. **El stock se actualiza en tiempo real** - Cada factura reduce el stock
3. **Los números de factura son secuenciales** - No pueden ser duplicados
4. **Las anulaciones son reversibles** - El stock se devuelve

---

## ✨ Próximas Mejoras Sugeridas

- [ ] Agregar impresión de facturas (PDF)
- [ ] Envío de facturas por email
- [ ] Historial de cambios de factura
- [ ] Reportes de facturas por rango de fecha
- [ ] Integración con contabilidad
- [ ] Códigos QR en facturas

---

**Última actualización:** Mayo 2026  
**Estado:** ✅ Operativo
