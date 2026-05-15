const db = require('./db');

class AlertaModel {
  // Obtener todas las alertas
  static async getAll() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            p.id, p.nombre, p.stock, p.stock_minimo,
            CASE 
              WHEN p.stock <= p.stock_minimo THEN 'critico'
              WHEN p.stock <= (p.stock_minimo * 1.5) THEN 'bajo'
              ELSE 'normal'
            END as nivel_alerta,
            p.fecha_actualizacion
          FROM Productos p
          WHERE p.stock <= (p.stock_minimo * 1.5)
          ORDER BY 
            CASE 
              WHEN p.stock <= p.stock_minimo THEN 0
              ELSE 1
            END ASC,
            p.stock ASC
        `);
      return result.recordset || [];
    } catch (error) {
      console.error('Error en AlertaModel.getAll:', error);
      throw error;
    }
  }

  // Obtener alertas por nivel
  static async getByNivel(nivel) {
    try {
      const pool = await db.connect();
      let query = `
        SELECT 
          p.id, p.nombre, p.stock, p.stock_minimo,
          CASE 
            WHEN p.stock <= p.stock_minimo THEN 'critico'
            WHEN p.stock <= (p.stock_minimo * 1.5) THEN 'bajo'
            ELSE 'normal'
          END as nivel_alerta,
          p.fecha_actualizacion
        FROM Productos p
        WHERE 1=1
      `;

      if (nivel === 'critico') {
        query += ` AND p.stock <= p.stock_minimo`;
      } else if (nivel === 'bajo') {
        query += ` AND p.stock > p.stock_minimo AND p.stock <= (p.stock_minimo * 1.5)`;
      }

      query += ` ORDER BY p.stock ASC`;

      const result = await pool.request().query(query);
      return result.recordset || [];
    } catch (error) {
      console.error('Error en AlertaModel.getByNivel:', error);
      throw error;
    }
  }

  // Obtener resumen de alertas
  static async getSummary() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            SUM(CASE WHEN stock <= stock_minimo THEN 1 ELSE 0 END) as criticas,
            SUM(CASE WHEN stock > stock_minimo AND stock <= (stock_minimo * 1.5) THEN 1 ELSE 0 END) as bajas,
            COUNT(*) as total
          FROM Productos
          WHERE stock <= (stock_minimo * 1.5)
        `);
      return result.recordset[0] || { criticas: 0, bajas: 0, total: 0 };
    } catch (error) {
      console.error('Error en AlertaModel.getSummary:', error);
      throw error;
    }
  }
}

module.exports = AlertaModel;
