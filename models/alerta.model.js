const db = require('../db');

class AlertaModel {
  /**
   * Obtiene todas las alertas delegando la lógica de severidad a la vista de la BD.
   * El filtrado por nivel ('Crítico', 'Bajo') debe hacerse en el frontend para ahorrar peticiones.
   */
  static async getAll() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            nombre, 
            stock_actual, 
            stock_minimo, 
            severidad, 
            recomendacion 
          FROM vw_Alertas_Inventario
          ORDER BY 
            CASE severidad 
              WHEN 'Crítico' THEN 1 
              WHEN 'Bajo' THEN 2 
              ELSE 3 
            END ASC, 
            stock_actual ASC
        `);
      return result.recordset || [];
    } catch (error) {
      console.error('Error en AlertaModel.getAll:', error);
      throw error;
    }
  }

  /**
   * Reutiliza la vista de métricas generales para obtener el resumen.
   * Resolviendo tu duda: Sí, es mejor usar la vista 'vw_Dashboard_Metricas' 
   * que ya tiene el conteo de productos en alerta.
   */
  static async getSummary() {
    try {
      const pool = await db.connect();
      const result = await pool
        .request()
        .query(`
          SELECT 
            productos_en_alerta as total,
            (SELECT COUNT(*) FROM vw_Alertas_Inventario WHERE severidad = 'Crítico') as criticas,
            (SELECT COUNT(*) FROM vw_Alertas_Inventario WHERE severidad = 'Bajo') as bajas
          FROM vw_Dashboard_Metricas
        `);
      
      return result.recordset[0] || { criticas: 0, bajas: 0, total: 0 };
    } catch (error) {
      console.error('Error en AlertaModel.getSummary:', error);
      throw error;
    }
  }
}

module.exports = AlertaModel;