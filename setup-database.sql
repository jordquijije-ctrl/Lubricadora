


-- SCRIPT SQL PARA CREAR LA BASE DE DATOS
-- Ejecutar en SQL Server Management Studio

-- Intentar crear la base de datos solo si no estamos en un entorno restringido como Somee
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'LubricadorasDiana')
BEGIN
    -- Nota: Esto fallará en Somee, pero el IF evita que se detenga el script si ya existe
    EXEC('CREATE DATABASE LubricadorasDiana');
END
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'LubricadorasDiana')
BEGIN
    EXEC('USE LubricadorasDiana'); -- Agrégale el EXEC y las comillas
END
GO

-- TABLA DE PRODUCTOS
CREATE TABLE Productos (
  id INT PRIMARY KEY IDENTITY(1,1),
  nombre NVARCHAR(255) NOT NULL,
  codigo NVARCHAR(50) UNIQUE NOT NULL,
  categoria NVARCHAR(100),
  precio_compra DECIMAL(10,2),
  precio_venta DECIMAL(10,2),
  stock INT DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  proveedor NVARCHAR(255),
  fecha_creacion DATETIME DEFAULT GETDATE(),
  fecha_actualizacion DATETIME DEFAULT GETDATE()
);
-- TABLA DE PROVEEDORES
CREATE TABLE Proveedores (
  id INT PRIMARY KEY IDENTITY(1,1),
  nombre NVARCHAR(255) NOT NULL,
  ruc NVARCHAR(50) UNIQUE NOT NULL,
  categoria NVARCHAR(100),
  ciudad NVARCHAR(100),
  telefono NVARCHAR(20),
  email NVARCHAR(100),
  contacto NVARCHAR(255),
  fecha_creacion DATETIME DEFAULT GETDATE(),
  fecha_actualizacion DATETIME DEFAULT GETDATE()
);

-- TABLA DE MOVIMIENTOS (Entradas/Salidas)
CREATE TABLE Movimientos (
  id INT PRIMARY KEY IDENTITY(1,1),
  producto_id INT NOT NULL,
  tipo NVARCHAR(20), -- 'entrada' o 'salida'
  cantidad INT,
  referencia NVARCHAR(100), -- Número de factura u orden
  usuario NVARCHAR(100),
  proveedor_id INT,
  descripcion NVARCHAR(255),
  fecha DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (producto_id) REFERENCES Productos(id),
  FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id)
);

-- TABLA DE USUARIOS
CREATE TABLE Usuarios (
  id INT PRIMARY KEY IDENTITY(1,1),
  usuario NVARCHAR(50) UNIQUE NOT NULL,
  nombre NVARCHAR(255),
  rol NVARCHAR(50), -- 'admin' o 'empleado'
  activo BIT DEFAULT 1,
  fecha_creacion DATETIME DEFAULT GETDATE()
);



-- TABLA DE FACTURAS
CREATE TABLE Facturas (
  id INT PRIMARY KEY IDENTITY(1,1),
  numero_factura NVARCHAR(50) UNIQUE NOT NULL,
  cliente NVARCHAR(255) NOT NULL,
  ruc_cliente NVARCHAR(50),
  fecha DATETIME DEFAULT GETDATE(),
  total DECIMAL(12,2),
  estado NVARCHAR(50) DEFAULT 'Pagada', -- 'Pagada', 'Pendiente', 'Anulada'
  usuario NVARCHAR(100),
  notas NVARCHAR(MAX),
  fecha_actualizacion DATETIME DEFAULT GETDATE()
);

-- TABLA DE DETALLES DE FACTURAS
CREATE TABLE Factura_Detalles (
  id INT PRIMARY KEY IDENTITY(1,1),
  factura_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT,
  precio_unitario DECIMAL(10,2),
  subtotal DECIMAL(12,2),
  FOREIGN KEY (factura_id) REFERENCES Facturas(id),
  FOREIGN KEY (producto_id) REFERENCES Productos(id)
);


-- ÍNDICES
CREATE INDEX idx_producto_codigo ON Productos(codigo);
CREATE INDEX idx_producto_categoria ON Productos(categoria);
CREATE INDEX idx_movimiento_producto ON Movimientos(producto_id);
CREATE INDEX idx_movimiento_fecha ON Movimientos(fecha);
CREATE INDEX idx_factura_numero ON Facturas(numero_factura);
CREATE INDEX idx_factura_fecha ON Facturas(fecha);
CREATE INDEX idx_proveedor_ruc ON Proveedores(ruc);

-- INSERTS DE EJEMPLO
INSERT INTO Productos (nombre, codigo, categoria, precio_compra, precio_venta, stock, stock_minimo, proveedor)
VALUES 
  ('Castrol GTX 20W-50', 'SKU-001', 'Aceites', 10.00, 14.99, 48, 10, 'Castrol Ecuador'),
  ('Havoline 10W-40', 'SKU-002', 'Aceites', 7.50, 10.99, 7, 10, 'Texaco / Havoline'),
  ('Filtro aceite Toyota', 'SKU-015', 'Filtros', 5.00, 9.99, 22, 5, 'Shell Ecuador'),
  ('Valvoline MaxLife 5W-30', 'SKU-008', 'Aceites', 12.00, 17.99, 3, 10, 'Valvoline'),
  ('Liqui Moly Ceratec', 'SKU-022', 'Aditivos', 15.00, 21.99, 15, 5, 'Castrol Ecuador');

INSERT INTO Usuarios (usuario, nombre, rol)
VALUES 
  ('admin', 'Jeremi Vera', 'admin'),
  ('empleado', 'Diana Castillo', 'empleado');

-- INSERTS DE PROVEEDORES DE EJEMPLO
INSERT INTO Proveedores (nombre, ruc, categoria, ciudad, telefono, email, contacto)
VALUES 
  ('Castrol Ecuador', '0991234567001', 'Aceites', 'Quito', '+593-2-2234567', 'ventas@castrol.ec', 'Carlos Mendez'),
  ('Texaco / Havoline', '0992345678001', 'Aceites y aditivos', 'Guayaquil', '+593-4-2345678', 'info@texaco.ec', 'Maria López'),
  ('Shell Ecuador', '0993456789001', 'Aceites premium', 'Quito', '+593-2-3456789', 'contacto@shell.ec', 'Juan Pérez'),
  ('Valvoline Distribuidora', '0994567890001', 'Aceites sintéticos', 'Quito', '+593-2-4567890', 'ventas@valvoline.ec', 'Ana García'),
  ('Liqui Moly Import', '0995678901001', 'Aditivos', 'Guayaquil', '+593-4-5678901', 'info@liquimoly.ec', 'Pedro Silva'),
  ('Filtros del Pacifico', '0996789012001', 'Filtros automotrices', 'Quito', '+593-2-6789012', 'ventas@filtros.ec', 'Rosa Martinez');

-- INSERTS DE FACTURAS DE EJEMPLO
INSERT INTO Facturas (numero_factura, cliente, ruc_cliente, total, estado, usuario)
VALUES 
  ('FAC-4821', 'Carlos Mendoza', '1721345678', 41.50, 'Pagada', 'admin'),
  ('FAC-4820', 'María López', '1721456789', 29.40, 'Pagada', 'admin'),
  ('FAC-4819', 'Juan Pérez', '1721567890', 42.90, 'Pagada', 'admin'),
  ('FAC-4818', 'Ana García', '1721678901', 21.00, 'Pagada', 'admin');

-- INSERTS DE MOVIMIENTOS DE EJEMPLO
INSERT INTO Movimientos (producto_id, tipo, cantidad, referencia, usuario, proveedor_id, descripcion)
VALUES 
  (1, 'salida', 2, 'FAC-4821', 'admin', NULL, 'Venta a Carlos Mendoza'),
  (2, 'entrada', 24, 'Orden #1847', 'admin', 2, 'Compra a Texaco'),
  (2, 'salida', 3, 'FAC-4820', 'admin', NULL, 'Venta a María López'),
  (2, 'salida', 1, 'FAC-4819', 'admin', NULL, 'Venta a Juan Pérez'),
  (4, 'entrada', 12, 'Orden #1845', 'admin', 4, 'Compra a Valvoline'),
  (5, 'entrada', 20, 'Orden #1844', 'admin', 5, 'Compra a Liqui Moly');

-- INSERTS DE DETALLES DE FACTURAS
INSERT INTO Factura_Detalles (factura_id, producto_id, cantidad, precio_unitario, subtotal)
VALUES 
  (1, 1, 2, 14.99, 29.98),
  (1, 3, 1, 9.99, 9.99),
  (2, 2, 3, 10.99, 32.97),
  (3, 2, 1, 10.99, 10.99),
  (3, 5, 1, 21.99, 21.99),
  (4, 4, 1, 17.99, 17.99),
  (4, 3, 1, 9.99, 9.99);

GO

-- VISTAS ÚTILES
CREATE VIEW vw_productos_bajo_stock AS
SELECT * FROM Productos 
WHERE stock <= stock_minimo
-- ORDER BY stock ASC;

GO

CREATE VIEW vw_producto_valoracion AS
SELECT 
  id, nombre, codigo, stock, precio_venta,
  (stock * precio_venta) AS valoracion_total
FROM Productos
-- ORDER BY valoracion_total DESC;

GO
