const db = require('../db');

class ProveedorModel {
  // Obtener todos los proveedores
  static async getAll() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            id, nombre, ruc, categoria, ciudad, telefono, 
            email, contacto, fecha_creacion
          FROM Proveedores
          ORDER BY nombre ASC
        `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener proveedor por ID
  static async getById(id) {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .input('id', db.sql.Int, id)
        .query('SELECT * FROM Proveedores WHERE id = @id');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear nuevo proveedor
  static async create(datos) {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .input('nombre', db.sql.NVarChar, datos.nombre)
        .input('ruc', db.sql.NVarChar, datos.ruc)
        .input('categoria', db.sql.NVarChar, datos.categoria || null)
        .input('ciudad', db.sql.NVarChar, datos.ciudad || null)
        .input('telefono', db.sql.NVarChar, datos.telefono || null)
        .input('email', db.sql.NVarChar, datos.email || null)
        .input('contacto', db.sql.NVarChar, datos.contacto || null)
        .query(`
          INSERT INTO Proveedores (nombre, ruc, categoria, ciudad, telefono, email, contacto)
          VALUES (@nombre, @ruc, @categoria, @ciudad, @telefono, @email, @contacto);
          SELECT SCOPE_IDENTITY() as id;
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar proveedor
  static async update(id, datos) {
    try {
      const pool = await db.connect();
      await pool
        .request()
        .input('id', db.sql.Int, id)
        .input('nombre', db.sql.NVarChar, datos.nombre)
        .input('ruc', db.sql.NVarChar, datos.ruc)
        .input('categoria', db.sql.NVarChar, datos.categoria || null)
        .input('ciudad', db.sql.NVarChar, datos.ciudad || null)
        .input('telefono', db.sql.NVarChar, datos.telefono || null)
        .input('email', db.sql.NVarChar, datos.email || null)
        .input('contacto', db.sql.NVarChar, datos.contacto || null)
        .query(`
          UPDATE Proveedores 
          SET nombre = @nombre, ruc = @ruc, categoria = @categoria, 
              ciudad = @ciudad, telefono = @telefono, email = @email, 
              contacto = @contacto, fecha_actualizacion = GETDATE()
          WHERE id = @id
        `);
      return { id, ...datos };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar proveedor
  static async delete(id) {
    try {
      const pool = await db.connect();
      await pool
        .request()
        .input('id', db.sql.Int, id)
        .query('DELETE FROM Proveedores WHERE id = @id');
      return { id };
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas del proveedor
  static async getStats(id) {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .input('id', db.sql.Int, id)
        .query(`
          SELECT 
            p.id, p.nombre,
            COUNT(DISTINCT pr.id) as total_productos,
            COUNT(m.id) as total_movimientos,
            SUM(CASE WHEN m.tipo = 'entrada' THEN m.cantidad ELSE 0 END) as total_entradas,
            MAX(m.fecha) as ultima_entrada
          FROM Proveedores p
          LEFT JOIN Productos pr ON p.nombre = pr.proveedor
          LEFT JOIN Movimientos m ON p.id = m.proveedor_id
          WHERE p.id = @id
          GROUP BY p.id, p.nombre
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProveedorModel;
