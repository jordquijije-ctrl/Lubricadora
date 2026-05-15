


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

-- 1. VISTA DE ALERTAS (Sin cambios, esta funciona bien)
CREATE VIEW vw_Alertas_Inventario AS
SELECT 
    nombre,
    stock AS stock_actual,
    stock_minimo,
    CASE 
        WHEN stock <= (stock_minimo * 0.3) THEN 'Crítico'
        WHEN stock <= stock_minimo THEN 'Bajo'
        ELSE 'Óptimo'
    END AS severidad,
    CASE 
        WHEN stock <= (stock_minimo * 0.3) THEN 'Generar orden de compra inmediata.'
        WHEN stock <= stock_minimo THEN 'Reabastecer esta semana.'
        ELSE 'Sin acción requerida.'
    END AS recomendacion
FROM Productos
WHERE stock <= stock_minimo;
GO

-- 2. VISTA DE MÉTRICAS GENERALES (Corregida: Agregado punto y coma y estructura escalar limpia)
CREATE VIEW vw_Dashboard_Metricas AS
SELECT 
    (SELECT SUM(stock) FROM Productos) AS total_unidades,
    (SELECT SUM(stock * precio_compra) FROM Productos) AS valoracion_inventario_costo,
    (SELECT COUNT(*) FROM Productos WHERE stock <= stock_minimo) AS productos_en_alerta,
    (SELECT ISNULL(SUM(cantidad), 0) FROM Movimientos 
     WHERE tipo = 'salida' AND (referencia LIKE 'FAC-%' OR referencia = 'AJUSTE')
     AND fecha >= DATEADD(MONTH, -1, GETDATE())) AS movimiento_mensual_unidades;
GO

-- 3. VISTA PRODUCTOS ESTRELLA (Corregida: Agrupación explícita por nombre)
CREATE VIEW vw_Productos_Estrella AS
SELECT TOP 10
    p.nombre,
    SUM(fd.cantidad) AS unidades_vendidas,
    SUM(fd.subtotal) AS ingresos_generados,
    CASE 
        WHEN SUM(fd.cantidad) > 100 THEN 'Alta'
        WHEN SUM(fd.cantidad) > 50 THEN 'Media'
        ELSE 'Baja'
    END AS rotacion_label
FROM Productos p
JOIN Factura_Detalles fd ON p.id = fd.producto_id
JOIN Facturas f ON fd.factura_id = f.id
WHERE f.fecha >= DATEADD(MONTH, -1, GETDATE())
GROUP BY p.nombre -- En SQL Server basta con el nombre si no hay IDs ambiguos
ORDER BY unidades_vendidas DESC;
GO

-- 4. VISTA PRODUCTOS HUESO (Corregida: Manejo de NULL en DATEDIFF)
CREATE VIEW vw_Productos_Hueso AS
SELECT 
    p.nombre,
    ISNULL(DATEDIFF(DAY, MAX(m.fecha), GETDATE()), 999) AS dias_sin_movimiento,
    (p.stock * p.precio_compra) AS capital_atrapado
FROM Productos p
LEFT JOIN Movimientos m ON p.id = m.producto_id
GROUP BY p.nombre, p.stock, p.precio_compra
HAVING MAX(m.fecha) < DATEADD(DAY, -30, GETDATE()) OR MAX(m.fecha) IS NULL;
GO

-- 5. VISTA INDICADORES FINANCIEROS (CORRECCIÓN CRÍTICA)
-- Se separan los cálculos en subconsultas para evitar duplicar el capital inmovilizado
CREATE VIEW vw_Indicadores_Financieros AS
SELECT 
    -- Margen: (Ventas - Costos) / Ventas
    CAST(
        CASE WHEN Ventas.TotalVentas > 0 
        THEN ((Ventas.TotalVentas - Ventas.CostoVentas) / Ventas.TotalVentas) * 100 
        ELSE 0 END 
    AS DECIMAL(10,2)) AS margen_utilidad_porcentaje,
    
    ISNULL(Inv.Capital, 0) AS capital_inmovilizado,
    
    -- Días promedio: Inventario / (Costo de ventas diario)
    CAST(
        CASE WHEN Ventas.CostoVentas > 0 
        THEN (Inv.Capital / (Ventas.CostoVentas / 30.0)) 
        ELSE 0 END 
    AS DECIMAL(10,1)) AS dias_promedio_inventario
FROM 
    (SELECT SUM(stock * precio_compra) AS Capital FROM Productos) AS Inv,
    (SELECT 
        ISNULL(SUM(fd.subtotal), 0) AS TotalVentas,
        ISNULL(SUM(fd.cantidad * p.precio_compra), 0) AS CostoVentas
     FROM Factura_Detalles fd
     JOIN Productos p ON fd.producto_id = p.id
     JOIN Facturas f ON fd.factura_id = f.id
     WHERE f.fecha >= DATEADD(MONTH, -1, GETDATE())) AS Ventas;
GO

CREATE TYPE dbo.DetalleVentaTipo AS TABLE (
    producto_id INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2)
);

GO

CREATE PROCEDURE registrar_Salida
    @numero_factura NVARCHAR(50),
    @cliente NVARCHAR(255),
    @ruc_cliente NVARCHAR(50),
    @usuario NVARCHAR(100),
    @detalles dbo.DetalleVentaTipo READONLY 
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @factura_id INT;
    DECLARE @total_calculado DECIMAL(12,2);

    -- CCalculo del total
    SELECT @total_calculado = SUM(cantidad * precio_unitario) FROM @detalles;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Verificar stock
        IF EXISTS (
            SELECT 1 FROM @detalles d
            JOIN Productos p ON d.producto_id = p.id
            WHERE p.stock < d.cantidad
        )
        BEGIN
            RAISERROR('Venta cancelada: Uno o más productos no tienen stock suficiente.', 16, 1);
        END

        --Crear la Factura
        INSERT INTO Facturas (numero_factura, cliente, ruc_cliente, total, usuario, fecha)
        VALUES (@numero_factura, @cliente, @ruc_cliente, @total_calculado, @usuario, GETDATE());
        
        SET @factura_id = SCOPE_IDENTITY();

        --Crear detalles
        INSERT INTO Factura_Detalles (factura_id, producto_id, cantidad, precio_unitario, subtotal)
        SELECT @factura_id, producto_id, cantidad, precio_unitario, (cantidad * precio_unitario)
        FROM @detalles;

        -- Registrar movimiento
        INSERT INTO Movimientos (producto_id, tipo, cantidad, referencia, usuario, descripcion, fecha)
        SELECT producto_id, 'salida', cantidad, @numero_factura, @usuario, 'Venta Facturada', GETDATE()
        FROM @detalles;

        -- Actualizar stock
        UPDATE p
        SET p.stock = p.stock - d.cantidad,
            p.fecha_actualizacion = GETDATE()
        FROM Productos p
        JOIN @detalles d ON p.id = d.producto_id;

        COMMIT TRANSACTION;
        PRINT 'Venta realizada con éxito.';
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;

go

CREATE PROCEDURE registrar_Salida_Manual
    @producto_id INT,
    @cantidad INT,
    @descripcion NVARCHAR(255),
    @usuario NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validación de cantidad
    IF @cantidad <= 0
    BEGIN
        RAISERROR('La cantidad debe ser un número positivo.', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Verificar stock actual
        DECLARE @stock_actual INT;
        SELECT @stock_actual = stock FROM Productos WHERE id = @producto_id;

        IF @stock_actual < @cantidad
        BEGIN
            RAISERROR('Operación cancelada: Stock insuficiente para realizar el ajuste.', 16, 1);
        END

        -- 2. Insertar movimiento de salida
        -- Usamos 'AJUSTE' en referencia para diferenciarlo de las facturas 'FAC-XXX'
        INSERT INTO Movimientos (
            producto_id, 
            tipo, 
            cantidad, 
            referencia, 
            usuario, 
            descripcion, 
            fecha
        )
        VALUES (
            @producto_id, 
            'salida', 
            @cantidad, 
            'AJUSTE', 
            @usuario, 
            @descripcion, 
            GETDATE()
        );

        -- 3. Actualizar el stock en la tabla Productos
        UPDATE Productos 
        SET stock = stock - @cantidad,
            fecha_actualizacion = GETDATE()
        WHERE id = @producto_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;

go

CREATE PROCEDURE registrar_Entrada
    @proveedor_id INT,
    @referencia_documento NVARCHAR(100), 
    @usuario NVARCHAR(100),
    @detalles dbo.DetalleVentaTipo READONLY 
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Registrar movimiento
        INSERT INTO Movimientos (
            producto_id, 
            tipo, 
            cantidad, 
            referencia, 
            usuario, 
            proveedor_id, 
            descripcion, 
            fecha
        )
        SELECT 
            producto_id, 
            'entrada', 
            cantidad, 
            @referencia_documento, 
            @usuario, 
            @proveedor_id, 
            'Compra a proveedor', 
            GETDATE()
        FROM @detalles;

        -- Actualizar stock
        UPDATE p
        SET p.stock = p.stock + d.cantidad,
            p.fecha_actualizacion = GETDATE()
        FROM Productos p
        JOIN @detalles d ON p.id = d.producto_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
    
        ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

