const db = require('../db');

class EstadisticaModel {
  static async getGenerales() {
  try {
    const pool = await db.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM vw_Estadisticas_Generales`);
    
    const row = result.recordset[0];
    console.log("DB Raw Row:", row); // PRINT DE CONTROL 1

    return {
      total_productos: row["Total Productos"] || 0,
      total_unidades_stock: row["Total Unidades Stock"] || 0,
      valor_inventario: row["Valor Inventario"] || 0,
      total_ventas: row["Total Ventas"] || 0
    };
  } catch (error) {
    console.error("Error en getGenerales Model:", error);
    throw error;
  }
}

  static async getTopProductos() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`SELECT * FROM vw_Productos_Estrella`);
      return result.recordset; 
    } catch (error) {
      throw error;
    }
  }

  static async getEstadoInventario() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`SELECT v.*, p.categoria FROM vw_Estado_Inventario_Detallado v LEFT JOIN Productos p ON v.id = p.id ORDER BY v.nombre`);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getDashboard() {
    try {
      const [generales, estrella] = await Promise.all([
        this.getGenerales(),
        this.getTopProductos()
      ]);
      return {
        metricas_resumen: generales,
        top_productos: estrella
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EstadisticaModel;