const db = require('./db');

class MovimientoModel {
  // Obtener todos los movimientos
  static async getAll(filtros = {}) {
    try {
      const pool = await db.connect();
      let query = `
        SELECT 
          m.id, m.producto_id, p.nombre as producto, m.tipo, 
          m.cantidad, m.referencia, m.usuario, m.descripcion,
          pr.nombre as proveedor, m.fecha
        FROM Movimientos m
        JOIN Productos p ON m.producto_id = p.id
        LEFT JOIN Proveedores pr ON m.proveedor_id = pr.id
        WHERE 1=1
      `;

      const request = pool.request();

      if (filtros.tipo) {
        query += ` AND m.tipo = @tipo`;
        request.input('tipo', db.sql.NVarChar, filtros.tipo);
      }

      if (filtros.producto_id) {
        query += ` AND m.producto_id = @producto_id`;
        request.input('producto_id', db.sql.Int, filtros.producto_id);
      }

      query += ` ORDER BY m.fecha DESC`;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por producto
  static async getByProducto(producto_id) {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .input('producto_id', db.sql.Int, producto_id)
        .query(`
          SELECT m.*, p.nombre as producto, pr.nombre as proveedor
          FROM Movimientos m
          JOIN Productos p ON m.producto_id = p.id
          LEFT JOIN Proveedores pr ON m.proveedor_id = pr.id
          WHERE m.producto_id = @producto_id
          ORDER BY m.fecha DESC
        `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Crear nuevo movimiento (entrada)
  static async registrarEntrada(datos) {
    try {
      const pool = await db.connect();
      
      // Crear movimiento
      const resultMovimiento = await pool
        .request()
        .input('producto_id', db.sql.Int, datos.producto_id)
        .input('tipo', db.sql.NVarChar, 'entrada')
        .input('cantidad', db.sql.Int, datos.cantidad)
        .input('referencia', db.sql.NVarChar, datos.referencia || null)
        .input('usuario', db.sql.NVarChar, datos.usuario || 'sistema')
        .input('proveedor_id', db.sql.Int, datos.proveedor_id || null)
        .input('descripcion', db.sql.NVarChar, datos.descripcion || null)
        .query(`
          INSERT INTO Movimientos (producto_id, tipo, cantidad, referencia, usuario, proveedor_id, descripcion)
          VALUES (@producto_id, @tipo, @cantidad, @referencia, @usuario, @proveedor_id, @descripcion);
          SELECT SCOPE_IDENTITY() as id;
        `);

      const movimientoId = resultMovimiento.recordset[0].id;

      // Actualizar stock del producto
      await pool
        .request()
        .input('producto_id', db.sql.Int, datos.producto_id)
        .input('cantidad', db.sql.Int, datos.cantidad)
        .query(`
          UPDATE Productos 
          SET stock = stock + @cantidad, fecha_actualizacion = GETDATE()
          WHERE id = @producto_id
        `);

      return { id: movimientoId, tipo: 'entrada', ...datos };
    } catch (error) {
      throw error;
    }
  }

  // Crear movimiento de salida
  static async registrarSalida(datos) {
    try {
      const pool = await db.connect();
      
      // Crear movimiento
      const resultMovimiento = await pool
        .request()
        .input('producto_id', db.sql.Int, datos.producto_id)
        .input('tipo', db.sql.NVarChar, 'salida')
        .input('cantidad', db.sql.Int, datos.cantidad)
        .input('referencia', db.sql.NVarChar, datos.referencia || null)
        .input('usuario', db.sql.NVarChar, datos.usuario || 'sistema')
        .input('descripcion', db.sql.NVarChar, datos.descripcion || null)
        .query(`
          INSERT INTO Movimientos (producto_id, tipo, cantidad, referencia, usuario, descripcion)
          VALUES (@producto_id, @tipo, @cantidad, @referencia, @usuario, @descripcion);
          SELECT SCOPE_IDENTITY() as id;
        `);

      const movimientoId = resultMovimiento.recordset[0].id;

      // Actualizar stock del producto (restar)
      await pool
        .request()
        .input('producto_id', db.sql.Int, datos.producto_id)
        .input('cantidad', db.sql.Int, datos.cantidad)
        .query(`
          UPDATE Productos 
          SET stock = stock - @cantidad, fecha_actualizacion = GETDATE()
          WHERE id = @producto_id
        `);

      return { id: movimientoId, tipo: 'salida', ...datos };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar movimiento
  static async delete(id) {
    try {
      const pool = await db.connect();
      
      // Obtener movimiento para revertir cambios de stock
      const movimiento = await pool
        .request()
        .input('id', db.sql.Int, id)
        .query('SELECT * FROM Movimientos WHERE id = @id');

      if (movimiento.recordset.length === 0) {
        throw new Error('Movimiento no encontrado');
      }

      const mov = movimiento.recordset[0];

      // Revertir cambios de stock
      if (mov.tipo === 'entrada') {
        await pool
          .request()
          .input('producto_id', db.sql.Int, mov.producto_id)
          .input('cantidad', db.sql.Int, mov.cantidad)
          .query(`
            UPDATE Productos 
            SET stock = stock - @cantidad, fecha_actualizacion = GETDATE()
            WHERE id = @producto_id
          `);
      } else {
        await pool
          .request()
          .input('producto_id', db.sql.Int, mov.producto_id)
          .input('cantidad', db.sql.Int, mov.cantidad)
          .query(`
            UPDATE Productos 
            SET stock = stock + @cantidad, fecha_actualizacion = GETDATE()
            WHERE id = @producto_id
          `);
      }

      // Eliminar movimiento
      await pool
        .request()
        .input('id', db.sql.Int, id)
        .query('DELETE FROM Movimientos WHERE id = @id');

      return { id };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MovimientoModel;
