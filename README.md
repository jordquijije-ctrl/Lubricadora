# Lubricadoras Diana - Sistema de Control de Inventario

## Estructura de archivos

Los archivos CSS y JavaScript han sido separados del HTML para mejor mantenibilidad:

### Archivos principales:
- **lubricadoras-diana-sistema (2).html** - Archivo HTML principal con toda la estructura
- **styles.css** - Estilos CSS separados
- **script.js** - Código JavaScript separado

## Funcionalidades

### Módulo de Autenticación
- Login con rol seleccionable (Administrador/Empleado)
- Gestión de sesiones y restricciones por rol
- Credenciales demo incluidas

### Panel de Administración
- **Dashboard**: Vista general con estadísticas
- **Productos**: Catálogo de productos
- **Facturación**: Gestión de facturas
- **Movimientos**: Registro de entradas y salidas
- **Alertas**: Sistema de notificaciones
- **Proveedores**: Gestión de proveedores (Admin)
- **Estadísticas**: Reportes y gráficos (Admin)
- **Reportes NIC 2**: Informes contables (Admin)

## Credenciales de prueba

**Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

**Empleado:**
- Usuario: `empleado`
- Contraseña: `emp123`

## Notas técnicas

- Uso de CSS variables para tema
- Diseño responsivo para desktop y mobile
- Animaciones suaves con transiciones CSS
- Sistema de toasts para notificaciones
- Modales reutilizables para formularios
