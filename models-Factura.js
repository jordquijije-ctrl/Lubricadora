const db = require('./db');

class FacturaModel {
  // Obtener todas las facturas
  static async getAll() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            id, numero_factura, cliente, ruc_cliente, fecha, 
            total, estado, usuario, fecha_actualizacion
          FROM Facturas
          ORDER BY fecha DESC
        `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener factura por ID con detalles
  static async getById(id) {
    try {
      const pool = await db.connect();
      
      // Obtener factura
      const resultFactura = await pool
        .request()
        .input('id', db.sql.Int, id)
        .query('SELECT * FROM Facturas WHERE id = @id');

      if (resultFactura.recordset.length === 0) {
        return null;
      }

      const factura = resultFactura.recordset[0];

      // Obtener detalles
      const resultDetalles = await pool
        .request()
        .input('factura_id', db.sql.Int, id)
        .query(`
          SELECT 
            fd.id, fd.producto_id, p.nombre as producto, 
            fd.cantidad, fd.precio_unitario, fd.subtotal
          FROM Factura_Detalles fd
          JOIN Productos p ON fd.producto_id = p.id
          WHERE fd.factura_id = @factura_id
        `);

      factura.detalles = resultDetalles.recordset;
      return factura;
    } catch (error) {
      throw error;
    }
  }

  // Obtener próximo número de factura
  static async getProximoNumero() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT TOP 1 numero_factura FROM Facturas 
          ORDER BY id DESC
        `);

      if (result.recordset.length === 0) {
        return 'FAC-4801';
      }

      const ultima = result.recordset[0].numero_factura;
      const numero = parseInt(ultima.split('-')[1]) + 1;
      return `FAC-${numero}`;
    } catch (error) {
      throw error;
    }
  }

  // Crear nueva factura
  static async create(datos) {
    try {
      const pool = await db.connect();

      // Generar número de factura
      const proximoNumero = await this.getProximoNumero();

      // Insertar factura
      const resultFactura = await pool
        .request()
        .input('numero_factura', db.sql.NVarChar, proximoNumero)
        .input('cliente', db.sql.NVarChar, datos.cliente)
        .input('ruc_cliente', db.sql.NVarChar, datos.ruc_cliente || null)
        .input('total', db.sql.Decimal(12, 2), datos.total || 0)
        .input('estado', db.sql.NVarChar, datos.estado || 'Pagada')
        .input('usuario', db.sql.NVarChar, datos.usuario || 'sistema')
        .input('notas', db.sql.NVarChar, datos.notas || null)
        .query(`
          INSERT INTO Facturas (numero_factura, cliente, ruc_cliente, total, estado, usuario, notas)
          VALUES (@numero_factura, @cliente, @ruc_cliente, @total, @estado, @usuario, @notas);
          SELECT SCOPE_IDENTITY() as id;
        `);

      const facturaId = resultFactura.recordset[0].id;

      // Insertar detalles y actualizar stock
      if (datos.detalles && datos.detalles.length > 0) {
        for (const detalle of datos.detalles) {
          await pool
            .request()
            .input('factura_id', db.sql.Int, facturaId)
            .input('producto_id', db.sql.Int, detalle.producto_id)
            .input('cantidad', db.sql.Int, detalle.cantidad)
            .input('precio_unitario', db.sql.Decimal(10, 2), detalle.precio_unitario)
            .input('subtotal', db.sql.Decimal(12, 2), detalle.subtotal)
            .query(`
              INSERT INTO Factura_Detalles (factura_id, producto_id, cantidad, precio_unitario, subtotal)
              VALUES (@factura_id, @producto_id, @cantidad, @precio_unitario, @subtotal)
            `);

          // Restar del stock (salida)
          await pool
            .request()
            .input('producto_id', db.sql.Int, detalle.producto_id)
            .input('cantidad', db.sql.Int, detalle.cantidad)
            .query(`
              UPDATE Productos 
              SET stock = stock - @cantidad, fecha_actualizacion = GETDATE()
              WHERE id = @producto_id
            `);

          // Registrar movimiento de salida
          await pool
            .request()
            .input('producto_id', db.sql.Int, detalle.producto_id)
            .input('tipo', db.sql.NVarChar, 'salida')
            .input('cantidad', db.sql.Int, detalle.cantidad)
            .input('referencia', db.sql.NVarChar, proximoNumero)
            .input('usuario', db.sql.NVarChar, datos.usuario)
            .query(`
              INSERT INTO Movimientos (producto_id, tipo, cantidad, referencia, usuario)
              VALUES (@producto_id, @tipo, @cantidad, @referencia, @usuario)
            `);
        }
      }

      return { id: facturaId, numero_factura: proximoNumero, ...datos };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estado de factura
  static async updateEstado(id, estado) {
    try {
      const pool = await db.connect();
      await pool
        .request()
        .input('id', db.sql.Int, id)
        .input('estado', db.sql.NVarChar, estado)
        .query(`
          UPDATE Facturas 
          SET estado = @estado, fecha_actualizacion = GETDATE()
          WHERE id = @id
        `);
      return { id, estado };
    } catch (error) {
      throw error;
    }
  }

  // Anular factura
  static async anular(id) {
    try {
      const pool = await db.connect();

      // Obtener factura con detalles
      const factura = await this.getById(id);
      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      // Revertir stock de todos los productos
      for (const detalle of factura.detalles) {
        await pool
          .request()
          .input('producto_id', db.sql.Int, detalle.producto_id)
          .input('cantidad', db.sql.Int, detalle.cantidad)
          .query(`
            UPDATE Productos 
            SET stock = stock + @cantidad, fecha_actualizacion = GETDATE()
            WHERE id = @producto_id
          `);
      }

      // Cambiar estado a Anulada
      await pool
        .request()
        .input('id', db.sql.Int, id)
        .query(`
          UPDATE Facturas 
          SET estado = 'Anulada', fecha_actualizacion = GETDATE()
          WHERE id = @id
        `);

      return { id, estado: 'Anulada' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FacturaModel;
