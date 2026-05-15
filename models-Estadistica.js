const db = require('./db');

class EstadisticaModel {
  // Obtener estadísticas generales
  static async getGenerales() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            COUNT(DISTINCT p.id) as total_productos,
            SUM(CAST(p.stock as INT)) as cantidad_total,
            SUM(CAST((p.stock * p.precio_venta) as DECIMAL(12,2))) as valor_inventario,
            COUNT(DISTINCT f.id) as total_facturas,
            SUM(CAST(f.total as DECIMAL(12,2))) as total_ventas,
            COUNT(DISTINCT pr.id) as total_proveedores
          FROM Productos p
          LEFT JOIN Facturas f ON 1=1
          LEFT JOIN Proveedores pr ON 1=1
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener top productos más vendidos
  static async getTopProductos(limite = 10) {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .input('limite', db.sql.Int, limite)
        .query(`
          SELECT TOP (@limite)
            p.id, p.nombre, p.codigo, p.precio_venta,
            SUM(CAST(fd.cantidad as INT)) as cantidad_vendida,
            SUM(CAST(fd.subtotal as DECIMAL(12,2))) as ingresos,
            AVG(CAST(fd.cantidad as INT)) as promedio_venta
          FROM Factura_Detalles fd
          JOIN Productos p ON fd.producto_id = p.id
          GROUP BY p.id, p.nombre, p.codigo, p.precio_venta
          ORDER BY cantidad_vendida DESC
        `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener ventas por período
  static async getVentasPorPeriodo(periodo = 'mes') {
    try {
      const pool = await db.connect();
      let groupBy = '';
      
      if (periodo === 'dia') {
        groupBy = `CONVERT(DATE, f.fecha)`;
      } else if (periodo === 'semana') {
        groupBy = `DATEPART(YEAR, f.fecha), DATEPART(WEEK, f.fecha)`;
      } else if (periodo === 'mes') {
        groupBy = `DATEPART(YEAR, f.fecha), DATEPART(MONTH, f.fecha)`;
      }

      const result = await pool
        .request()
        .query(`
          SELECT 
            ${groupBy} as periodo,
            COUNT(DISTINCT f.id) as num_facturas,
            SUM(CAST(f.total as DECIMAL(12,2))) as monto_total,
            AVG(CAST(f.total as DECIMAL(12,2))) as promedio
          FROM Facturas f
          WHERE f.estado != 'Anulada'
          GROUP BY ${groupBy}
          ORDER BY periodo DESC
        `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener estado del inventario
  static async getEstadoInventario() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            p.id, p.nombre, p.codigo, p.stock, p.stock_minimo, p.precio_venta,
            CAST((p.stock * p.precio_venta) as DECIMAL(12,2)) as valor,
            CASE 
              WHEN p.stock <= p.stock_minimo THEN 'Crítico'
              WHEN p.stock <= (p.stock_minimo * 1.5) THEN 'Bajo'
              ELSE 'Normal'
            END as estado_stock
          FROM Productos p
          ORDER BY p.nombre
        `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por período
  static async getMovimientosResumen(periodo = 'mes') {
    try {
      const pool = await db.connect();
      let groupBy = '';
      
      if (periodo === 'dia') {
        groupBy = `CONVERT(DATE, m.fecha)`;
      } else if (periodo === 'semana') {
        groupBy = `DATEPART(YEAR, m.fecha), DATEPART(WEEK, m.fecha)`;
      } else if (periodo === 'mes') {
        groupBy = `DATEPART(YEAR, m.fecha), DATEPART(MONTH, m.fecha)`;
      }

      const result = await pool
        .request()
        .query(`
          SELECT 
            ${groupBy} as periodo,
            m.tipo,
            SUM(CAST(m.cantidad as INT)) as cantidad_total,
            COUNT(*) as num_movimientos
          FROM Movimientos m
          GROUP BY ${groupBy}, m.tipo
          ORDER BY periodo DESC, m.tipo
        `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EstadisticaModel;
