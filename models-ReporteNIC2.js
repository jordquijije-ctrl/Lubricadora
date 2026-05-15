const db = require('./db');

class ReporteNIC2Model {
  // Obtener balance de inventario (Base NIC 2)
  static async getBalanceInventario(fecha = null) {
    try {
      const pool = await db.connect();
      let query = `
        SELECT 
          p.id, p.nombre, p.codigo, p.categoria,
          p.stock as cantidad_final,
          p.precio_compra,
          p.precio_venta,
          CAST((p.stock * p.precio_compra) as DECIMAL(12,2)) as valor_costo,
          CAST((p.stock * p.precio_venta) as DECIMAL(12,2)) as valor_venta
        FROM Productos p
        WHERE 1=1
      `;

      const request = pool.request();
      
      if (fecha) {
        query += ` AND p.fecha_actualizacion <= @fecha`;
        request.input('fecha', db.sql.DateTime, fecha);
      }

      query += ` ORDER BY p.categoria, p.nombre`;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener resumen por categoría
  static async getResumenPorCategoria(fecha = null) {
    try {
      const pool = await db.connect();
      let query = `
        SELECT 
          p.categoria,
          COUNT(DISTINCT p.id) as num_productos,
          SUM(CAST(p.stock as INT)) as cantidad_total,
          SUM(CAST((p.stock * p.precio_compra) as DECIMAL(12,2))) as valor_costo_total,
          SUM(CAST((p.stock * p.precio_venta) as DECIMAL(12,2))) as valor_venta_total
        FROM Productos p
        WHERE 1=1
      `;

      const request = pool.request();
      
      if (fecha) {
        query += ` AND p.fecha_actualizacion <= @fecha`;
        request.input('fecha', db.sql.DateTime, fecha);
      }

      query += ` GROUP BY p.categoria ORDER BY p.categoria`;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimiento de mercancías (FIFO implied)
  static async getMovimientoMercancia(fecha_inicio = null, fecha_fin = null) {
    try {
      const pool = await db.connect();
      let query = `
        SELECT 
          m.id, m.fecha, m.tipo, p.nombre as producto, m.cantidad,
          p.precio_compra, p.precio_venta,
          CAST((m.cantidad * p.precio_compra) as DECIMAL(12,2)) as costo_total,
          m.referencia, m.usuario
        FROM Movimientos m
        JOIN Productos p ON m.producto_id = p.id
        WHERE 1=1
      `;

      const request = pool.request();
      
      if (fecha_inicio) {
        query += ` AND m.fecha >= @fecha_inicio`;
        request.input('fecha_inicio', db.sql.DateTime, fecha_inicio);
      }

      if (fecha_fin) {
        query += ` AND m.fecha <= @fecha_fin`;
        request.input('fecha_fin', db.sql.DateTime, fecha_fin);
      }

      query += ` ORDER BY m.fecha DESC`;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener costo de ventas
  static async getCostoVentas(fecha_inicio = null, fecha_fin = null) {
    try {
      const pool = await db.connect();
      let query = `
        SELECT 
          f.numero_factura, f.fecha, f.cliente,
          SUM(CAST((fd.cantidad * p.precio_compra) as DECIMAL(12,2))) as costo_venta,
          SUM(CAST(fd.subtotal as DECIMAL(12,2))) as ingresos,
          SUM(CAST((fd.subtotal - (fd.cantidad * p.precio_compra)) as DECIMAL(12,2))) as ganancia
        FROM Facturas f
        JOIN Factura_Detalles fd ON f.id = fd.factura_id
        JOIN Productos p ON fd.producto_id = p.id
        WHERE f.estado != 'Anulada'
      `;

      const request = pool.request();
      
      if (fecha_inicio) {
        query += ` AND f.fecha >= @fecha_inicio`;
        request.input('fecha_inicio', db.sql.DateTime, fecha_inicio);
      }

      if (fecha_fin) {
        query += ` AND f.fecha <= @fecha_fin`;
        request.input('fecha_fin', db.sql.DateTime, fecha_fin);
      }

      query += ` GROUP BY f.id, f.numero_factura, f.fecha, f.cliente ORDER BY f.fecha DESC`;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener flujo de caja
  static async getFlujoCAja(fecha_inicio = null, fecha_fin = null) {
    try {
      const pool = await db.connect();
      let query = `
        SELECT 
          f.fecha, 'Venta' as tipo_movimiento, COUNT(*) as num_documentos,
          SUM(CAST(f.total as DECIMAL(12,2))) as monto
        FROM Facturas f
        WHERE f.estado = 'Pagada'
      `;

      const request = pool.request();
      
      if (fecha_inicio) {
        query += ` AND f.fecha >= @fecha_inicio`;
        request.input('fecha_inicio', db.sql.DateTime, fecha_inicio);
      }

      if (fecha_fin) {
        query += ` AND f.fecha <= @fecha_fin`;
        request.input('fecha_fin', db.sql.DateTime, fecha_fin);
      }

      query += ` GROUP BY f.fecha ORDER BY f.fecha DESC`;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReporteNIC2Model;
